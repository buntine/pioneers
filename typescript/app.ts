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
          people.push(new Person(p, new Vector(0, 0)));
        }

        svg.clear();
        people.draw(svg);
      }
    );
  });
});
