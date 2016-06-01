/// <reference path='impact/impact.ts'/>
/// <reference path='impact/person.ts'/>
/// <reference path='impact/people.ts'/>
/// <reference path='impact/title.ts'/>
/// <reference path='timeline/groups.ts'/>
/// <reference path='structure/interfaces.ts'/>
/// <reference path='structure/tab.ts'/>
/// <reference path='structure/app_state.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='helpers.ts'/>
/// <reference path='toggler.ts'/>
/// <reference path='d/snapsvg.d.ts'/>
/// <reference path='d/mustache.d.ts'/>

declare var $: any;

$(() => {
    let svg = Snap("#impactcanvas");
    let state: Structure.AppState;
    let tabs: {[K: string]: Structure.Tab} = {
      "impact": new Impact.Impact(),
      "timeline": new Impact.Impact(),
      "geography": new Impact.Impact(),
    };

    let op = new Toggler(Snap("#opcanvas"), ["or", "and"]).draw((_: TogglerState, t: TogglerOption) => {
        $("#op").val(t.toUpperCase());
        search();
    });

    $("select.tags").selectivity({placeholder: "Search one or more topics... e.g Programming, Theory of Computation, Concurrency"});

    $(window).on("popstate", setState)
             .on("load", setDimensions)
             .on("resize", setDimensions);

    $("#tab").selectivity({
        allowClear: false,
        showSearchInputInDropdown: false});

    $("div.tags, #op, #tab").change((e: Event) => {
        e.preventDefault();
        search();
    });

    function search(): void {
        state = {tab: $("#tab").val(),
                 op: $("#op").val(),
                 tags: $("select.tags").selectivity("value")};

        // Catch for changing and/or operator or tab before searching as it should have no effect.
        if (people.length > 0 || state.tags.length > 0) {
            writeState();
            executeState();
        }
    }

    function timeline(): void {
        $.getJSON("/people", state, (d: {people:Array<Structure.Person>}) => {
            let groups = new Timeline.Groups(svg);
            
            groups.build(d.people);
            groups.draw();
        });
    }

    function geography(): void {
       // TODO: Implement.
       console.log("geography");
    }

    function splash(): void {
        svg.clear();
        formToState({op: "or", tags: []});
        $("#splash").show();
    }

    function setDimensions(): void {
        tabs[state.tab].resize();
        setState();
    }

    function setState(): void {
        state : Structure.AppState = history.state || stateFromPath();
        executeState(true);
    }

    function stateFromPath(): Structure.AppState {
        let isValid = /^\/(impact|timeline|geography)\/(and|or)\/([\w\-\+]+)$/;
        let groups = isValid.exec(document.location.pathname);

        if (groups) {
            return {tab: groups[1],
                    op: groups[2],
                    tags: groups[3].split("+")};
        }

        // Default.
        return {tab: "impact", op: "or", tags: []};
    }

    function executeState(updateForm = false): void {
        if (state.tags.length > 0 && f) {
            $("#splash, #noresults").hide();

            if (tabs[state.tab].execute(state)) {
                $("#noresults").show();
            }

            if (updateForm) { formToState(); }
        } else {
            splash();
        }
    }

    function formToState(): void {
        op.setTo(state.op.toLowerCase());
        $("#op").val(state.op);
        $("select.tags").selectivity("value", state.tags, {triggerChange: false})
                        .selectivity("rerenderSelection");
    }

    function writeState(): void {
        let path = state.tags.length > 0 ? `/${state.tab}/${state.op.toLowerCase()}/${state.tags.join("+")}` : "/";
        history.pushState(state, null, path);
    }
});
