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
              public achievements: Array<IAchievement>, public wins: Array<IWin>) {}

  static fromIPerson(p:IPerson) {
    return new Person(p.name, p.country, p.gender, p.impact, p.biography, p.picture,
                      p.source, p.yod, p.yob, p.achievements, p.wins);
  }

  public draw(svg:Snap.Paper, unit:number) : void {
    let mass = (this.impact * unit);
    let radius = mass / 2.0;
    let img = new Image();

    // Just draw randomly for now until I get the particule system going...
    let x = Math.random() * (parseInt(svg.attr("width")) - mass) + radius;
    let y = Math.random() * (parseInt(svg.attr("height")) - mass) + radius;

    img.src = "/static/images/" + this.picture;

//    helpers.onMask(ctx, x, y, radius, () => {
//      ctx.drawImage(img, x - radius, y - radius, mass, mass);
//    });
  }
}

class People extends Array<Person> {
  private total:number;

  constructor() {
    super();
    this.total = 0;
  }

  private delta() : number {
    return 1 + ((this.length - 1) * 0.1);
  }

  public push(p:Person) : number {
    this.total += p.impact;
    return super.push(p);
  }

  public draw(svg:Snap.Paper) : void {
    let width = parseInt(svg.attr("width"));
    let height = parseInt(svg.attr("height"));
    let unit = Math.min(width / this.total, height / this.total) * this.delta();

    for (let p of this) {
      p.draw(svg, unit);
    }
  }
}
