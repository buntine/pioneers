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

  public distanceFrom(v:Vector) : number {
    let distance = Vector.sub(v, this.point);
    let m = distance.mag();
    return m;
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
  private center:Vector;

  constructor(public svg:Snap.Paper) {
    super();

    let width = parseInt(svg.attr("width"));
    let height = parseInt(svg.attr("height"));

    this.center = new Vector(width / 2.0, height / 2.0);
    this.total = 0;
  }

  private delta() : number {
    return 1 + ((this.length - 1) * 0.1);
  }

  public push(p:Person) : number {
    this.total += p.details.impact;
    return super.push(p);
  }

  public position(iteration = 1) : void {
    // Sort from closest to furthest to center point.
    this.sort((a:Person, b:Person) => {
      let c = this.center;
      return a.distanceFrom(c) - b.distanceFrom(c);
    });

    // Detract other particles.
    for (let i=0;i<this.length;i++) {
      for (let n=i+1;n<this.length;n++) {
        this[i].detract(this.svg, this[n]);
      }
    }

    // Attract to nenter point.
    for (let p of this) {
      p.attract(this.svg);
    }

    if (iteration < 100) {
      setTimeout(() => {
        this.position(iteration + 1);
      }, 100);
    }
  }

  public pack() : void {
    let width = this.center.x * 2;
    let height = this.center.y * 2;
    let unit = Math.min(width / this.total, height / this.total) * this.delta();

    for (let p of this) {
      p.draw(this.svg, unit);
    }

    this.position();
  }
}
