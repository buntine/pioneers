/// <reference path='helpers.ts'/>
/// <reference path='title.ts'/>

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
  public title : Title;
  public avatar : Snap.Element;
  public radius : number;
  private initialPoint : Vector;

  public static MAX_ZOOM = 250;
  public static MAX_SIZE = 350;

  constructor(public svg:Snap.Paper, public details:IPerson, public point:Vector) {
    this.initialPoint = new Vector(point.x, point.y);
    this.title = new Title(this);
  }

  public draw(unit:number) : void {
    let mass = Math.min(Person.MAX_SIZE, this.details.impact * unit);

    this.radius = mass / 2;

    let tl = this.topLeft();
    let pattern = this.svg.image(Helpers.imageSource("people", this.details.picture), tl.x, tl.y, mass, mass);

    this.avatar = this.svg.circle(this.point.x, this.point.y, this.radius);
    this.avatar.attr({fill: pattern.pattern(tl.x, tl.y, mass, mass),
                      stroke: "#888",
                      strokeWidth: 1,
                      cursor: "pointer"});

    this.avatar.click((e:MouseEvent) => this.show());
    this.avatar.hover((e:MouseEvent) => this.highlight(),
                      (e:MouseEvent) => { if (this.title.unhighlighted()) { this.unhighlight() }});
  }

  public position() : void {
    let v = Vector.sub(this.point, this.initialPoint);
    this.avatar.transform(`translate(${v.x}, ${v.y})`);
  }

  public detract(p:Person, padding:number) : void {
    let dist = this.point.distanceFrom(p.point);
    let radii = this.radius + p.radius + padding;

    // Overlapping, move away from each other.
    if (dist < radii) {
      let mid = (c:number) => { return (c / dist) * (radii - dist) * 0.5; };
      let v = Vector.sub(p.point, this.point);
      let tv = new Vector(mid(v.x), mid(v.y));

      this.point.sub(tv);
      p.point.add(tv);
    }
  }

  public attract(to:Vector, damping:number) : void {
    let v = Vector.sub(this.point, to);
    v.mul(damping);

    this.point.sub(v);
  }

  public show() : void {
    console.log(this.details.name);
  }

  public topLeft() : Vector {
    return Vector.sub(this.point, new Vector(this.radius, this.radius));
  }

  public flagSource() : string {
    return Helpers.imageSource("flags", `${this.details.country.toLowerCase()}.png`);
  }

  public highlight() : void {
    this.avatar.animate({strokeWidth: 6}, 800);
    this.title.initiate()
  }

  public unhighlight() : void {
    this.avatar.animate({strokeWidth: 2}, 140);
    this.avatar.stop().animate({strokeWidth: 1}, 300);
    this.title.finalize();
  }
}
