/// <reference path='impact/impact.ts'/>
/// <reference path='timeline/timeline.ts'/>
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
    let tabs: {[K: string]: Structure.Tab} = {
        "impact": new Impact.Impact(svg),
        "timeline": new Timeline.Timeline(svg),
        "geography": new Impact.Impact(svg),
    };

    let op = new Toggler(Snap("#opcanvas"), ["or", "and"]).draw((_: TogglerState, t: TogglerOption) => {
        $("#op").val(t.toUpperCase());
        search();
    });

    $("select.tags").selectivity({
        placeholder: "Search one or more topics... e.g Programming, Theory of Computation, Concurrency",
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
             .on("resize", (_:Event) => setDimensions())
             .on("load", () => {
                 setDimensions(true);

                 // Show initial intro screen if user is coming to homepage.
                 if (!searched()) {
                     $("#intro").show();
                 }
             });

    $("#tab_switcher a").click((e: Event) => {
        e.preventDefault();

        $("#tab_switcher a").removeClass("selected");
        $(e.target).addClass("selected");

        search(false);
    });

    $("div.tags, #op").change((e: Event) => {
        e.preventDefault();

        // If user is not changing tags or operation then do not rebuild tabs (aka Send AJAX).
        search();
    });

    $("#start").click((e: Event) => {
        e.preventDefault();

        $("#intro").hide();
        $("select.tags").selectivity("add", "algorithms-data-structures");
    });

    function clearTab(): void {
        let tab = tabs[state.tab];

        if (tab.built()) {
            tab.unfocus();
        }
    }

    function search(rebuild = true): void {
        clearTab();

        state = {tab: $("#tab_switcher a.selected").data("tab"),
                 op: $("#op").val(),
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
        formToState({op: "or", tags: []});
        $("#splash").show();
    }

    function resizeTab() {
        let page = $("div#page");
        let [width, height] = [page.width(), page.height()];

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
                    op: <Structure.OpState>groups[2],
                    tags: groups[3].split("+")};
        }

        // Default.
        return {tab: "impact", op: "or", tags: []};
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
                    t.execute();
                });
            } else {
                $("#noresults").show();
            }

            if (updateForm) { formToState(state); }
        } else {
            splash();
        }
    }

    function formToState(s: Structure.AppState): void {
        op.setTo(s.op.toLowerCase());
        $("#op").val(s.op);
        $("select.tags").selectivity("value", s.tags, {triggerChange: false})
                        .selectivity("rerenderSelection");
    }

    function writeState(): void {
        let path = searched() ? `/${state.tab}/${state.op.toLowerCase()}/${state.tags.join("+")}` : "/";
        history.pushState(state, null, path);
    }

    function searched(): boolean {
        return state.tags.length > 0;
    }
});
