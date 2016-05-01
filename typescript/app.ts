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
    let radius = this.impact * unit;
    let img = new Image();

    img.src = "/static/images/" + this.picture;

    // Just draw randomly for now until I get the particule system going...
    ctx.drawImage(img, Math.random() * (ctx.canvas.width - radius),
                  Math.random() * (ctx.canvas.height - radius), radius, radius);
  }
}

class People extends Array<Person> {
  private total:number;
  private static delta:number = 2.2;

  constructor() {
    super();
    this.total = 0;
  }

  public add(p:Person) {
    this.push(p);
    this.total += p.impact;
  }

  public draw(ctx:any) {
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
          people.add(Person.fromIPerson(p));
        }

        people.draw(ctx);
      }
    );
  });
});
