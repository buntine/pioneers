/// <reference path='impact/person.ts'/>
/// <reference path='impact/people.ts'/>
/// <reference path='impact/title.ts'/>
/// <reference path='structure/interfaces.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='helpers.ts'/>
/// <reference path='toggler.ts'/>
/// <reference path='d/snapsvg.d.ts'/>
/// <reference path='d/mustache.d.ts'/>

declare var $: any;

interface AppState {
    tab?: string,
    op: string,
    tags: Array<string>,
}

$(() => {
    let svg = Snap("#impactcanvas");
    let people = new Impact.People();

    let op = new Toggler(Snap("#opcanvas"), ["or", "and"]).draw((_: TogglerState, t: TogglerOption) => {
        $("#op").val(t.toUpperCase());
        search();
    });

    $("select.tags").selectivity({placeholder: "Search one or more topics... e.g Programming, Theory of Computation, Concurrency"});

    $(window).on("popstate", setState)
             .on("load", () => {setDimensions(); setState();})
             .on("resize", setDimensions);

    $("#tab").selectivity({
        allowClear: false,
        showSearchInputInDropdown: false});

    $("div.tags, #op, #tab").change((e: Event) => {
        e.preventDefault();
        search();
    });

    function search(): void {
        let state = {tab: $("#tab").val(),
                     op: $("#op").val(),
                     tags: $("select.tags").selectivity("value")};

        // Catch for changing and/or operator or tab before searching as it should have no effect.
        if (people.length > 0 || state.tags.length > 0) {
            writeState(state);
            executeState(state);
        }
    }

    function impact(state: AppState): void {
        $.getJSON("/people", state, (d: {people:Array<Structure.Person>}) => {
            let [w, h] = ["width", "height"].map(a => parseInt(svg.attr(a)));
            let nr = $("#noresults");

            people.clear();

            for (let p of d.people) {
                people.push(new Impact.Person(svg, p, Vector.randomized(w, h)));
            }

            svg.clear();

            if (people.length > 0) {
                nr.hide();
                people.pack();
            } else {
                nr.show();
            }
        });
    }

    function timeline(state: AppState): void {
        // TODO: Implement.
        console.log("timeline");
    }

    function geography(state: AppState): void {
       // TODO: Implement.
       console.log("geography");
    }

    function splash(): void {
        svg.clear();
        formToState({op: "or", tags: []});
        $("#splash").show();
    }

    function setDimensions(): void {
        let [width, height] = [$(window).width(), $(window).height() - $("#impactcanvas").offset().top];

        people.centerize(width, height);
        svg.attr({width: width, height: height});

        setState();
    }

    function setState(): void {
        let state : AppState = history.state || stateFromPath();
        executeState(state, true);
    }

    function stateFromPath(): AppState {
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

    function executeState(state: AppState, updateForm = false): void {
        let fs: {[K: string]: (s: AppState) => void} = {"impact": impact, "timeline": timeline, "geography": geography};
        let f = fs[state.tab];

        if (state.tags.length > 0 && f) {
            $("#splash").hide();
            f(state);

            if (updateForm) { formToState(state); }
        } else {
            splash();
        }
    }

    function formToState(state: AppState): void {
        op.setTo(state.op.toLowerCase());
        $("#op").val(state.op);
        $("select.tags").selectivity("value", state.tags, {triggerChange: false})
                        .selectivity("rerenderSelection");
    }

    function writeState(state: AppState): void {
        let path = state.tags.length > 0 ? `/${state.tab}/${state.op.toLowerCase()}/${state.tags.join("+")}` : "/";
        history.pushState(state, null, path);
    }
});
