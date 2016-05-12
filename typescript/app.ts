/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='d/snapsvg.d.ts'/>

declare var $:any;

$(() => {
  let svg_i = Snap("#impactcanvas");
  let svg_o = Snap("#opcanvas");

  svg_i.attr({width: $(window).width() - 20,
            height: $(window).height() - $("#impactcanvas").offset().top + 7});

  let people = new People(svg_i);

  $("#tags").selectivity({placeholder: "Choose one or more topics"});

  let op_switch = svg_o.rect(2, 2, 46, 42, 5);
  let op_text = svg_o.text(15, 28, "or");
  let op_group = svg_o.group(op_switch, op_text);
  op_text.attr({fill: "#fff", cursor: "pointer"});
  op_switch.attr({fill: "#4484c7", cursor: "pointer"});

  op_group.click((e:MouseEvent) => {
    if (op_text.attr("text") == "or") {
      op_switch.animate({x: 48}, 150);
      op_text.animate({x: 52}, 150);
      op_text.attr({text: "and"});
    } else {
      op_switch.animate({x: 2}, 150);
      op_text.animate({x: 15}, 150);
      op_text.attr({text: "or"});
    }

    $("#op").value(op_text.attr("text"));
  });

  $("#tags, #searchform input[name='op']").change((e:any) => {
    e.preventDefault();

    $.getJSON("/people", $("#search").serialize(),
      (d:{people:Array<IPerson>}) => {
        if (people.length > 0) {
          people.alive = false;
          people = new People(svg_i);
        }

        for (let p of d.people) {
          let x = Math.random() * parseInt(svg_i.attr("width"));
          let y = Math.random() * parseInt(svg_i.attr("height"));

          people.push(new Person(p, new Vector(x, y)));
        }

        svg_i.clear();
        people.pack();
      }
    );
  });
});
