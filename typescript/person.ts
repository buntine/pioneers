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

enum ShowState {
  Unhighlighted = 0,
  Waiting = 1,
  Zooming = 2,
  Done = 3,
}

class Person {
  public title : Snap.Element;
  public avatar : Snap.Element;
  public radius : number;
  public showState : ShowState;
  private initialPoint : Vector;

  public static MAX_ZOOM = 250;
  public static MAX_SIZE = 350;

  constructor(public svg:Snap.Paper, public details:IPerson, public point:Vector) {
    this.initialPoint = new Vector(point.x, point.y);
    this.showState = ShowState.Unhighlighted;
  }

  public draw(unit:number) : void {
    let mass = Math.min(Person.MAX_SIZE, this.details.impact * unit);

    this.radius = mass / 2;

    let tl = this.topLeft();
    let pattern = this.svg.image(this.imageSource(), tl.x, tl.y, mass, mass);

    this.avatar = this.svg.circle(this.point.x, this.point.y, this.radius);
    this.avatar.attr({fill: pattern.pattern(tl.x, tl.y, mass, mass),
                      stroke: "#888",
                      strokeWidth: 1,
                      cursor: "pointer"});

    this.avatar.click((e:MouseEvent) => this.show());
    this.avatar.hover((e:MouseEvent) => this.highlight(),
                      (e:MouseEvent) => { if (this.showState < ShowState.Zooming) { this.unhighlight() }});
  }

  public position() : void {
    let v = Vector.sub(this.point, this.initialPoint);
    this.avatar.transform(`translate(${v.x}, ${v.y})`);
  }

  public distanceFrom(v:Vector) : number {
    let distance = Vector.sub(v, this.point);
    return distance.mag();
  }

  public detract(p:Person, padding:number) : void {
    let dist = this.distanceFrom(p.point);
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

  private imageSource() : string {
    return "/static/images/people/" + this.details.picture;
  }

  private topLeft() : Vector {
    return Vector.sub(this.point, new Vector(this.radius, this.radius));
  }

  private showTitle() {
    if (this.showState == ShowState.Zooming) {
      this.title.animate({fillOpacity: 1}, 300, mina.linear, () => {
        this.showState = ShowState.Done;
      });
    }
  }

  private drawTitle() : void {
    let mz = Math.max(this.radius * 2, Person.MAX_ZOOM);
    let mid = new Vector(mz / 2, mz / 2);
    let pos = new Vector(this.point.x - mid.x, this.point.y + (mid.y - 30));

    let box = this.svg.rect(pos.x, pos.y, mz, 60, 6);
    let details = this.svg.text(pos.x + 76, pos.y + 33, this.details.name);

    details.attr({fill: "#232323", fontSize: "18px"});

    this.title = this.svg.group(box, details);
    this.title.attr({fill: "#fff", fillOpacity: 0});
  }

  private zoom() : void {
    if (this.showState != ShowState.Waiting) { return; }

    let mass = this.radius * 2;
    let scale = Person.MAX_ZOOM / mass;
    let p = this.point;
    let tl = this.topLeft();

    // In order to get zoom appearing correctly I need to draw new image over the existing one and
    // scale it. It's a hack, but without this I get weird behavious depending on the original draw
    // order of the people. The pattern also does not scale on the original person circle.
    let pattern = this.svg.image(this.imageSource(), tl.x, tl.y, mass, mass);
    let avatarBorder = this.svg.circle(p.x, p.y, this.radius);
    let avatar = avatarBorder.clone();
    let g = this.svg.group(pattern, avatarBorder);

    this.drawTitle();
    this.showState = ShowState.Zooming;

    avatar.attr({fill: "#fff"});
    pattern.attr({mask: avatar});
    avatarBorder.attr({fillOpacity: 0,
                       stroke: "#888",
                       strokeWidth: (6 / scale)});

    g.click((e:MouseEvent) => this.show());
    g.hover((e:MouseEvent) => {},
            (e:MouseEvent) => {
              this.unhighlight();
              g.animate({transform: "s1,1"}, 200, mina.linear, () => {g.remove();})});

    // Person is larger than MAX_ZOOM so skip zoom in.
    if (scale < 1) {
      this.showTitle()
    } else {
      g.animate({transform: `s${scale},${scale}`}, 500, mina.backout, () => {
        this.showTitle()
      });
    }
  }

  private highlight() : void {
    this.avatar.animate({strokeWidth: 6}, 800);
    this.showState = ShowState.Waiting;

    setTimeout(() => this.zoom(), 800);
  }

  private unhighlight() : void {
    if (this.showState >= ShowState.Zooming) {
      this.avatar.animate({strokeWidth: 2, r: this.radius}, 140);
      this.title.animate({fillOpacity: 0}, 150, mina.linear, () => {
        this.title.remove();
      });
    }

    this.avatar.stop().animate({strokeWidth: 1}, 300);
    this.showState = ShowState.Unhighlighted;
  }
}
