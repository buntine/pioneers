/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='toggler.ts'/>
/// <reference path='d/snapsvg.d.ts'/>
/// <reference path='d/mustache.d.ts'/>

declare var $:any;

interface IAppState {
  tab?: string,
  op: string,
  tags: Array<string>,
}

$(() => {
  let svg = Snap("#impactcanvas");
  let [width, height] = [$(window).width(), $(window).height() - $("#impactcanvas").offset().top];
  let people = new People(width, height);

  let op = new Toggler(Snap("#opcanvas"), ["or", "and"]).draw((_:TogglerState, t:TogglerOption) => {
    $("#op").val(t.toUpperCase());
    search();
  });

  let tab = new Toggler(Snap("#switchcanvas"), ["IMPACT", "TIMELINE"], 200, 220, 80).draw(search);

  svg.attr({width: width, height: height});

  $("select.tags").selectivity({
    placeholder: "Choose one or more topics...",
    minimumInputLength: 2,
    quiteMillis: 250,
  });

  window.addEventListener("popstate", setState);
  window.addEventListener("load", setState);

  $("div.tags, #op").change((e:any) => {
    e.preventDefault();
    search();
  });

  function search() : void {
    let currentTab = tab.getState()[1].toLowerCase();
    let state = {tab: currentTab,
                 op: $("#op").val(),
                 tags: $("select.tags").selectivity("value")};

    // Catch for changing and/or op before searching as it should have no effect.
    if (people.length > 0 || state.tags.length > 0) {
      writeState(state);
      executeState(state);
    }
  }

  function impact(state:IAppState) : void {
    $.getJSON("/people", state,
      (d:{people:Array<IPerson>}) => {
        let [w, h] = ["width", "height"].map((a) => parseInt(svg.attr(a)));
        let nr = $("#noresults");

        people.clear();

        for (let p of d.people) {
          people.push(new Person(svg, p, Vector.randomized(w, h)));
        }

        svg.clear();

        if (people.length > 0) {
          nr.hide();
          people.pack();
        } else {
          nr.show();
        }
      }
    );
  }

  function timeline(state:IAppState) : void {
    // TODO: Implement.
    console.log("timeline");
  }

  function splash() : void {
    svg.clear();
    formToState({op: "or", tags: []});
    $("#splash").show();
  }

  function setState() : void {
    let state : IAppState = history.state || stateFromPath();
    executeState(state, true);
  }

  function stateFromPath() : IAppState {
    let isValid = /^\/(impact|timeline)\/(and|or)\/([\w\-\+]+)$/;
    let groups = isValid.exec(document.location.pathname);

    if (groups) {
      return {tab: groups[1],
              op: groups[2],
              tags: groups[3].split("+")};
    }

    // Default.
    return {tab: "impact", op: "or", tags: []};
  }

  function executeState(state:IAppState, updateForm=false) : void {
    let fs : {[K : string]: any} = {"impact": impact, "timeline": timeline};
    let f = fs[state.tab];

    if (state.tags.length > 0 && f) {
      $("#splash").hide();
      f(state);

      if (updateForm) { formToState(state); }
    } else {
      splash();
    }
  }

  function formToState(state:IAppState) : void {
      op.setTo(state.op.toLowerCase());
      $("#op").val(state.op);
      $("select.tags").selectivity("value", state.tags, {triggerChange: false})
                      .selectivity("rerenderSelection");
  }

  function writeState(state:IAppState) : void {
    let path = state.tags.length > 0 ? `/${state.tab}/${state.op.toLowerCase()}/${state.tags.join("+")}` : "/";
    history.pushState(state, null, path);
  }
});
