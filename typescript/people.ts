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

class Person {
  constructor(public details: IPerson, public point: Vector) {}

  public draw(svg:Snap.Paper, unit:number) : void {
    let mass = (this.details.impact * unit);
    let radius = mass / 2.0;
    let imgsrc = "/static/images/" + this.details.picture;
    let x = Math.random() * (parseInt(svg.attr("width")) - mass) + radius;
    let y = Math.random() * (parseInt(svg.attr("height")) - mass) + radius;
    let mask = svg.circle(x, y, radius);
    let img = svg.image(imgsrc, x - radius, y - radius, mass, mass);

    mask.attr({fill: "white"});
    img.attr({mask: mask});
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
    this.total += p.details.impact;
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
