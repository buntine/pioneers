/// <reference path='impact/impact.ts'/>
/// <reference path='timeline/timeline.ts'/>
/// <reference path='geography/geography.ts'/>
/// <reference path='structure/interfaces.ts'/>
/// <reference path='structure/tab.ts'/>
/// <reference path='structure/app_state.ts'/>
/// <reference path='toggler.ts'/>
/// <reference path='d/snapsvg.d.ts'/>
/// <reference path='d/mustache.d.ts'/>

declare var $: any;

$(() => {
    let svg = Snap("#datacanvas");
    let state: Structure.AppState = stateFromPath();
    let firstSearch = true;
    let tabs: {[K: string]: Structure.Tab} = {
        "impact": new Impact.Impact(svg),
        "timeline": new Timeline.Timeline(svg),
        "geography": new Geography.Geography(svg),
    };

    let opSwitcher = new Toggler({
        selector: "#op_switcher",
        ops: [["OR", "OR"], ["AND", "AND"]],
        callback: (_: [string, string]) => {
            // Only fire another search if user is already searching more than one tag.
            if (searched(2)) {
                search();
            }
        }
    }).draw();

    let tabSwitcher = new Toggler({
        selector: "#tab_switcher",
        ops: [["Who?", "impact"], ["When?", "timeline"]],
        callback: (_: [string, string]) => {
            search(false);
        }
    }).draw();

    $("select.tags").selectivity({
        placeholder: "Search one or more topics... e.g Programming languages, Concurrency, Lisp",
        templates: {
            multipleSelectedItem: function(item: any) {
              return (`<span class="selectivity-multiple-selected-item" data-item-id="${item.id}">
                         ${item.text}
                         <a class="selectivity-multiple-selected-item-remove"><span class="fa fa-remove"></span></a>
                       </span>`);
            }
        },
    });

    $(window).on("popstate", () => {clearTab(); fetchState();})
             .on("orientationchange", (_: Event) => {
                 // As it turns out - repainting on mobile after an orientation change is tricky business. The event is fired
                 // before the DOM updates itself. So here I am taking the easy/ugly route by just waiting a little while until
                 // repainting. It should work *most* of the time...
                 setTimeout(() => {
                     setDimensions();
                 }, 900);
             })
             .on("resize", (_: Event) => {
                 if (!Helpers.isMobile()) {
                     setDimensions();
                 }
             })
             .on("load", () => {
                 setDimensions(true);

                 // Hide initial intro screen if user is not coming to homepage.
                 if (searched()) {
                     $("#intro").hide();
                 }
             });

    $("div.tags").change((e: Event) => {
        e.preventDefault();

        // Selectivity is triggering a second change event for unknown reasons. I was able to determine that
        // only this unwelcomed event happens to set the 'cancelable' attribute to false.
        // So I am checking for that as a somewhat dubious hack to filter out the event that I don't want.
        if (e.cancelable) {
            search();
        }
    });

    $("#start").click((e: Event) => {
        e.preventDefault();

        let tags = $(e.target).data("tags");
        let select = $("select.tags");

        $("#intro").hide();

        tags.split(",").forEach((t: string) => {
            select.selectivity("add", t);
        });

        if (!Helpers.isMobile()) {
            select.selectivity("focus");
        }
    });

    $("#looking_glass").click((e: Event) => {
        e.preventDefault();
        $("select.tags").selectivity("focus")
                        .selectivity("open");
    });

    $(document).on("click", "a.add_tag", (e: Event) => {
        e.preventDefault();

        let tag = $(e.target).data("tag");

        $.magnificPopup.close();
        setTags([tag]);
        search();
    });

    $(".popup").magnificPopup({
        type: "inline",
        midClick: true,
    });

    function clearTab(): void {
        let tab = tabs[state.tab];

        if (tab.built()) {
            tab.unfocus();
            $("div#pioneer").hide();
            $(".highlight_overlay").hide();
            svg.clear();
        }
    }

    function search(rebuild = true): void {
        clearTab();

        state = {tab: <Structure.TabState>tabSwitcher.getSelectedVal(),
                 op: <Structure.OpState>opSwitcher.getSelectedVal(),
                 tags: $("select.tags").selectivity("value")};

        // Catch for changing and/or operator or tab before searching as it should have no effect.
        if (tabs[state.tab].built() || searched()) {
            writeState();

            if (rebuild) {
                buildTabs(executeState);
            } else {
                executeState();
            }
        }
    }

    function buildTabs(f: () => any): void {
        if (searched()) {
            $.getJSON("/people", state, (d: {people:Array<Structure.Person>}) => {
                for (let t in tabs) {
                    tabs[t].build(d.people);
                }

                f();
            });
        } else {
            f();
        }
    }

    function splash(): void {
        svg.clear();
        formToState({op: "OR", tags: []});
        $("#splash").show();
    }

    function resizeTab() {
        let page = $("div#page");
        let [width, height] = [page.width(), page.height()];

        $("div#pioneer").css({width: width, height: height});
        svg.attr({width: width, height: height});
        tabs[state.tab].resize(width, height);
    }

    function setDimensions(rebuild = false): void {
        clearTab();
        resizeTab();
        fetchState(rebuild);
    }

    function fetchState(rebuild = true): void {
        state = history.state || stateFromPath();

        if (rebuild) {
            buildTabs(() => executeState(true));
        } else {
            executeState(true);
        }
    }

    function stateFromPath(): Structure.AppState {
        let isValid = /^\/(impact|timeline|geography)\/(and|or)\/([\w\-\+]+)$/;
        let groups = isValid.exec(document.location.pathname);

        if (groups) {
            return {tab: <Structure.TabState>groups[1],
                    op: <Structure.OpState>groups[2].toUpperCase(),
                    tags: groups[3].split("+")};
        }

        // Default.
        return {tab: "impact", op: "OR", tags: []};
    }

    function executeState(updateForm = false): void {
        if (searched()) {
            let t = tabs[state.tab];

            $("#splash, #noresults").hide();

            // Adjust tab to current window size.
            resizeTab();

            if (t.built()) {
                $("#loading").show();

                t.preload(() => {
                    $("#loading").hide();

                    // Chrome on mobile does not clear out the SVG correctly and also seems to change zoom level
                    // depending on what user is doing so I am forced to clear out the SVG one more time before
                    // I redraw it.
                    if (Helpers.isMobile()) {
                        svg.clear();
                    }

                    t.execute(firstSearch);
                    firstSearch = false;
                });
            } else {
                t.unfocus();
                $("#noresults").show();
            }

            if (updateForm) { formToState(state); }
        } else {
            splash();
        }
    }

    function formToState(s: Structure.AppState): void {
        opSwitcher.setTo(s.op);
        tabSwitcher.setTo(s.tab);
        setTags(s.tags);
    }

    function setTags(tags: Array<string>): void {
        $("select.tags").selectivity("value", tags, {triggerChange: false})
                        .selectivity("rerenderSelection");
    }

    function writeState(): void {
        let path = searched() ? `/${state.tab}/${state.op.toLowerCase()}/${state.tags.join("+")}` : "/";
        history.pushState(state, null, path);
    }

    function searched(minimum = 1): boolean {
        return state.tags.length >= minimum;
    }
});
