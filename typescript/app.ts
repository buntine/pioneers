/// <reference path='impact/impact.ts'/>
/// <reference path='impact/person.ts'/>
/// <reference path='impact/people.ts'/>
/// <reference path='impact/title.ts'/>
/// <reference path='timeline/timeline.ts'/>
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

    function clearTab(): void {
        let tab = tabs[state.tab];

        if (tab.built()) {
            tab.unfocus();
        }
    }

    function search(): void {
        clearTab();

        state = {tab: $("#tab").val(),
                 op: $("#op").val(),
                 tags: $("select.tags").selectivity("value")};

        // Catch for changing and/or operator or tab before searching as it should have no effect.
        if (tabs[state.tab].built() || state.tags.length > 0) {
            writeState();
            executeState();
        }
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
        state = history.state || stateFromPath();
        executeState(true);
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
        if (state.tags.length > 0) {
            $("#splash, #noresults").hide();

            if (!tabs[state.tab].execute(state)) {
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
        let path = state.tags.length > 0 ? `/${state.tab}/${state.op.toLowerCase()}/${state.tags.join("+")}` : "/";
        history.pushState(state, null, path);
    }
});
