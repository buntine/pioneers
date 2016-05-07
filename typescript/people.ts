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
  public image : Snap.Element;

  constructor(public details: IPerson, public point: Vector) {}

  public draw(svg:Snap.Paper, unit:number) : void {
    let mass = (this.details.impact * unit);
    let radius = mass / 2.0;
    let imgsrc = "/static/images/" + this.details.picture;
    let mask = svg.circle(this.point.x, this.point.y, radius);

    mask.attr({fill: "white"});

    this.image = svg.image(imgsrc, this.point.x - radius, this.point.y - radius, mass, mass);
    this.image.attr({mask: mask});
  }

  public position(svg:Snap.Paper) {
    // NOTE: SVG translate is relative to original x,y. translate(10, 0) means x+10, y+0.
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

  public position(svg:Snap.Paper, unit:number, iteration = 1) : void {
    let people = this;

    for (let p of this) {
      p.position(svg);
    }

    if (iteration < 100) {
      setTimeout(function(){
        people.position(svg, unit, iteration + 1);
      }, 100);
    }
  }

  public pack(svg:Snap.Paper) : void {
    let width = parseInt(svg.attr("width"));
    let height = parseInt(svg.attr("height"));
    let unit = Math.min(width / this.total, height / this.total) * this.delta();
    let people = this;

    for (let p of this) {
      p.draw(svg, unit);
    }

    this.position(svg, unit);
  }
}
