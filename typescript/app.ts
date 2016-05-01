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
    this.achievements = $.map(achievements, (a:IAchievement) => {return <IAchievement>a;})
    this.wins = $.map(wins, (a:IWin) => {return <IWin>a;})
  }

  static fromIPerson(p:IPerson) {
    return new Person(p.name, p.country, p.gender, p.impact, p.biography, p.picture,
                      p.source, p.yod, p.yob, p.achievements, p.wins);
  }

  public draw(ctx:any, unit:number) {
    console.log(this.impact * unit)
  }
}

class People {
  private people:Person[];
  private total:number;

  constructor() {
    this.people = [];
    this.total = 0;
  }

  public push(p:Person) {
    this.people.push(p);
    this.total += p.impact;
  }

  public draw(ctx:any) {
    let unit = Math.min(ctx.canvas.width / this.total, ctx.canvas.height / this.total);

    $.each(this.people, (_:any, p:Person) => { p.draw(ctx, unit); });
  }
}

$(function(){
  let canvas = $("#cvs");
  let ctx = canvas[0].getContext("2d");

  canvas.attr("width", $(window).width() - 20);
  canvas.attr("height", $(window).height() - canvas.offsetTop);

  $("#search").submit((e:any) => {
    e.preventDefault();

    $.getJSON("/people", $("#search").serialize(),
      (d:{people:IPerson}) => {
        let people:People = new People();

        $.each(d.people, (_:any, p:IPerson) => { people.push(Person.fromIPerson(p)); });
      }
    );
  });
});
