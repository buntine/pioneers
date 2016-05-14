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
  public title : Snap.Element;
  public avatar : Snap.Element;
  public radius : number;
  private initial_point : Vector;

  public static MAX_ZOOM = 250;

  constructor(public svg:Snap.Paper, public details:IPerson, public point:Vector) {
    this.initial_point = new Vector(point.x, point.y);
  }

  public draw(unit:number) : void {
    let mass = (this.details.impact * unit);

    this.radius = mass / 2.0;

    let x = this.point.x - this.radius;
    let y = this.point.y - this.radius;
    let imgsrc = "/static/images/" + this.details.picture;
    let pattern = this.svg.image(imgsrc, x, y, mass, mass);

    this.avatar = this.svg.circle(this.point.x, this.point.y, this.radius);
    this.avatar.attr({fill: pattern.pattern(x, y, mass, mass), stroke: "#888", strokeWidth: 1});

    this.avatar.click((e:MouseEvent) => this.show());
    this.avatar.hover((e:MouseEvent) => this.highlight(),
                      (e:MouseEvent) => () => {});
  }

  public position() : void {
    let v = Vector.sub(this.point, this.initial_point);
    this.avatar.transform(`translate(${v.x}, ${v.y})`);
  }

  public distanceFrom(v:Vector) : number {
    let distance = Vector.sub(v, this.point);

    return distance.mag();
  }

  public detract(p:Person, padding:number) : void {
    let dist = this.distanceFrom(p.point);
    let radii = this.radius + p.radius + padding;

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

  public highlight() : void {
    this.title = this.svg.rect(this.point.x - 100, this.point.y + (this.radius * 2) + 6, 200, 60, 2);
    this.title.attr({fill: "#fff", stroke: "#888", strokeWidth: 6, strokeOpacity: 0, fillOpacity: 0});

    let imgsrc = "/static/images/" + this.details.picture;
    let mass = this.radius * 2;
    let pattern = this.svg.image(imgsrc, this.point.x - this.radius, this.point.y - this.radius, mass, mass);
    let avatar_border = this.svg.circle(this.point.x, this.point.y, this.radius);
    let avatar = this.svg.circle(this.point.x, this.point.y, this.radius);
    let g = this.svg.group(pattern, avatar_border);
    let scale = (Person.MAX_ZOOM / mass);

    avatar_border.attr({fillOpacity: 0, stroke: "#888", strokeWidth: 2});
    avatar.attr({fill: "#fff"});
    pattern.attr({mask: avatar});

    g.hover((e:MouseEvent) => {},
            (e:MouseEvent) => {g.remove(); this.unhighlight()});

    g.animate({transform: `s${scale},${scale},${this.point.x},${this.point.y}`}, 800, mina.backout, () => {
      if (this.title) {
        this.title.animate({fillOpacity: 1, strokeOpacity: 1}, 500);
      }
    });
  }

  public unhighlight() : void {
    if (this.title) {
      this.avatar.animate({strokeWidth: 2, r: this.radius}, 140);
      this.title.remove();
      this.title = null;
    }
  }

}
