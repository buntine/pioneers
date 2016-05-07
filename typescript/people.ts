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

  // TODO Implement.
  public detract(svg:Snap.Paper, p:Person) : void {
  }

  // TODO Implement.
  public attract(svg:Snap.Paper) : void {
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

  // TODO: Implement.
  private comparer(a:Person, b:Person) {
    return 1;
  }

  public position(svg:Snap.Paper, iteration = 1) : void {
    // Sort from closest to furthest to center point.
    this.sort(this.comparer);

    // Detract other particles.
    for (let i=0;i<this.length;i++) {
      for (let n=i+1;n<this.length;n++) {
        this[i].detract(svg, this[n]);
      }
    }

    // Attract to center point.
    for (let p of this) {
      p.attract(svg);
    }

    if (iteration < 100) {
      setTimeout(() => {
        this.position(svg, iteration + 1);
      }, 100);
    }
  }

  public pack(svg:Snap.Paper) : void {
    let width = parseInt(svg.attr("width"));
    let height = parseInt(svg.attr("height"));
    let unit = Math.min(width / this.total, height / this.total) * this.delta();

    for (let p of this) {
      p.draw(svg, unit);
    }

    this.position(svg);
  }
}
