/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='d/snapsvg.d.ts'/>

declare var $:any;

$(() => {
  let svg = Snap("#svg");

  svg.attr({width: $(window).width() - 20,
            height: $(window).height() - $("#svg").offset().top - 4});

  let people = new People(svg);

  $("#search").submit((e:any) => {
    e.preventDefault();

    $.getJSON("/people", $("#search").serialize(),
      (d:{people:Array<IPerson>}) => {
        if (people.length > 0) {
          people.alive = false;
          people = new People(svg);
        }

        for (let p of d.people) {
          let x = Math.random() * parseInt(svg.attr("width"));
          let y = Math.random() * parseInt(svg.attr("height"));

          people.push(new Person(p, new Vector(x, y)));
        }

        svg.clear();
        people.pack();
      }
    );
  });
});
