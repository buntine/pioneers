/// <reference path='helpers.ts'/>

declare var $:any;

interface IWin {
  name: string;
  year: number;
}

interface IAchievement {
  description: string;
  source: string;
  impact: number;
  year: number;
}

interface IPerson {
  name: string;
  country: string;
  gender: string;
  impact: number;
  biography: string;
  picture: string;
  source: string;
  yob: number;
  yod: number;
  wins: Array<IWin>;
  achievements: Array<IAchievement>;
}

class Person implements IPerson {
  constructor(public name: string, public country: string, public gender: string, public impact: number, public biography: string,
              public picture: string, public source: string, public yob: number, public yod: number,
              public achievements: Array<IAchievement>, public wins: Array<IWin>) {
    this.name = name;
    this.country = country;
    this.gender = gender;
    this.impact = impact;
    this.biography = biography;
    this.picture = picture;
    this.source = source;
    this.yod = yod;
    this.yob = yob;
    this.achievements = $.map(achievements, (a:IAchievement) => {return <IAchievement>a;});
    this.wins = $.map(wins, (a:IWin) => {return <IWin>a;});
  }

  static fromIPerson(p:IPerson) {
    return new Person(p.name, p.country, p.gender, p.impact, p.biography, p.picture,
                      p.source, p.yod, p.yob, p.achievements, p.wins);
  }

  public draw(ctx:any, unit:number) : void {
    console.log(helpers.ass());
    let radius = (this.impact * unit) / 2.0;
    let img = new Image();

    // Just draw randomly for now until I get the particule system going...
    let x = Math.random() * (ctx.canvas.width - (radius * 2)) + radius;
    let y = Math.random() * (ctx.canvas.height - (radius * 2)) + radius;

    img.src = "/static/images/" + this.picture;

    ctx.save();
    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2, false);

    ctx.clip();

    ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);

    ctx.restore();
  }
}

class People extends Array<Person> {
  private total:number;
  private static delta:number = 1.5;

  constructor() {
    super();
    this.total = 0;
  }

  public push(p:Person) {
    this.total += p.impact;
    return super.push(p);
  }

  public draw(ctx:any) : void {
    let cvs = ctx.canvas;
    let unit = Math.min(cvs.width / this.total, cvs.height / this.total) * People.delta;

    for (let p of this) {
      p.draw(ctx, unit);
    }
  }
}

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
