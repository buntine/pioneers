/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='op_switch.ts'/>
/// <reference path='d/snapsvg.d.ts'/>

declare var $:any;

$(() => {
  let svg = Snap("#impactcanvas");
  let [width, height] = [$(window).width(),
                         $(window).height() - $("#impactcanvas").offset().top];

  svg.attr({width: width, height: height});

  let people = new People(width, height);

  $("select.tags").selectivity({placeholder: "Choose one or more topics..."});

  new OpSwitch(Snap("#opcanvas"), ["or", "and"]).draw((_:OpSwitchState, t:string) => {
    $("#op").val(t.toUpperCase()).change();
  });

  new OpSwitch(Snap("#switchcanvas"), ["IMPACT", "TIMELINE"], 200, 220, 80).draw((s:OpSwitchState, _:string) => {
    console.log(s);
  });

  $("div.tags, #op").change((e:any) => {
    e.preventDefault();
    impact();
  });

  function impact() : void {
    let op = $("#op").val();
    let tags = $("select.tags").selectivity("value");

    $.getJSON("/people", {op: $("#op").val(), tags: tags},
      (d:{people:Array<IPerson>}) => {
        writeState("impact", op, tags);

        people.clear();

        for (let p of d.people) {
          let [x, y] = [Math.random() * parseInt(svg.attr("width")),
                        Math.random() * parseInt(svg.attr("height"))];

          people.push(new Person(svg, p, new Vector(x, y)));
        }

        svg.clear();
        people.pack();
      }
    );
  }

  function timeline() : void {
    // TODO: Implement.
  }

  function writeState(tab:string, op:string, tags:Array<string>) : void {
    history.pushState(null, null, `/${tab}/${op.toLowerCase()}/${tags.join("+")}`);
  }
});
