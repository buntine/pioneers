/// <reference path='helpers.ts'/>
/// <reference path='people.ts'/>
/// <reference path='d/snapsvg.d.ts'/>

declare var $:any;

$(function(){
  let cvs = $("#cvs")[0];
  let ctx = cvs.getContext("2d");

  cvs.width = $(window).width() - 20;
  cvs.height = $(window).height() - cvs.offsetTop;

  $("#search").submit((e:any) => {
    e.preventDefault();

    $.getJSON("/people", $("#search").serialize(),
      (d:{people:Array<IPerson>}) => {
        let people:People = new People();

        ctx.clearRect(0, 0, cvs.width, cvs.height);

        for (let p of d.people) {
          people.push(Person.fromIPerson(p));
        }

        people.draw(ctx);
      }
    );
  });
});
