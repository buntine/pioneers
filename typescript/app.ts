/// <reference path='people.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='d/snapsvg.d.ts'/>

declare var $:any;

$(function(){
  let svg = Snap("#svg");

  svg.attr({width: $(window).width() - 20,
            height: $(window).height() - $("#svg").offset().top});

  $("#search").submit((e:any) => {
    e.preventDefault();

    $.getJSON("/people", $("#search").serialize(),
      (d:{people:Array<IPerson>}) => {
        let people:People = new People();

        for (let p of d.people) {
          let x = Math.random() * parseInt(svg.attr("width"));
          let y = Math.random() * parseInt(svg.attr("height"));

          people.push(new Person(p, new Vector(x, y)));
        }

        svg.clear();
        people.pack(svg);
      }
    );
  });
});
