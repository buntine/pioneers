/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='op_switch.ts'/>
/// <reference path='d/snapsvg.d.ts'/>

declare var $:any;

$(() => {
  let svg_i = Snap("#impactcanvas");

  svg_i.attr({width: $(window).width(),
              height: $(window).height() - $("#impactcanvas").offset().top});

  let people = new People(svg_i);

  $("select.tags").selectivity({placeholder: "Choose one or more topics..."});

  new OpSwitch(Snap("#opcanvas"), ["or", "and"]).draw((_:OpSwitchState, t:string) => {
    $("#op").val(t.toUpperCase()).change();
  });

  new OpSwitch(Snap("#switchcanvas"), ["IMPACT", "TIMELINE"], 200, 220, 80).draw((s:OpSwitchState, _:string) => {
    console.log(s);
  });

  $("div.tags, #op").change((e:any) => {
    e.preventDefault();

    $.getJSON("/people", {op: $("#op").val(), tags: $("select.tags").selectivity("value")},
      (d:{people:Array<IPerson>}) => {
        if (people.length > 0) {
          people.alive = false;
          people = new People(svg_i);
        }

        for (let p of d.people) {
          let [x, y] = [Math.random() * parseInt(svg_i.attr("width")),
                        Math.random() * parseInt(svg_i.attr("height"))];

          people.push(new Person(p, new Vector(x, y)));
        }

        svg_i.clear();
        people.pack();
      }
    );
  });
});
