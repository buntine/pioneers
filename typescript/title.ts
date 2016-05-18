/// <reference path='helpers.ts'/>

enum ShowState {
  Unhighlighted = 0,
  Waiting = 1,
  Zooming = 2,
  Done = 3,
}

class Title {
  public state : ShowState;
  public title : Snap.Element;

  public static WAIT = 800;

  constructor(public person:Person) {
    this.state = ShowState.Unhighlighted;
  }

  public unhighlighted() : boolean {
    return this.state < ShowState.Zooming;
  }

  public shown() : boolean {
    return this.state >= ShowState.Zooming;
  }

  public initiate() : void {
    this.state = ShowState.Waiting;

    setTimeout(() => this.zoom(), Title.WAIT);
  }

  public showTitle() {
    if (this.state == ShowState.Zooming) {
      this.title.animate({fillOpacity: 1}, 300, mina.linear, () => {
        this.state = ShowState.Done;
      });
    }
  }

  public drawTitle() : void {
    let p = this.person;
    let mz = Math.max(p.radius * 2, Person.MAX_ZOOM);
    let mid = new Vector(mz / 2, mz / 2);
    let pos = new Vector(p.point.x - mid.x, p.point.y + (mid.y - 30));
    let box = p.svg.rect(pos.x, pos.y, mz, 60, 6);
    let details = p.svg.text(pos.x + 80, pos.y + 33, p.details.name);
    let flagMask = p.svg.image("/static/images/flags/us.png", pos.x, pos.y, 80, 60);
    let flag = p.svg.rect(pos.x, pos.y, 79, 60, 6);

    flag.attr({fill: flagMask.pattern(pos.x - 6, pos.y, 80, 60)});
    details.attr({fill: "#232323", fontSize: "18px", fontFamily: "sans-serif, arial"});

    this.title = p.svg.group(box, details, flag);
    this.title.attr({fill: "#fff", fillOpacity: 0});
  }

  public zoom() : void {
    if (this.state != ShowState.Waiting) { return; }

    let p = this.person;
    let mass = p.radius * 2;
    let scale = Person.MAX_ZOOM / mass;
    let pt = p.point;
    let tl = p.topLeft();

    // In order to get zoom appearing correctly I need to draw new image over the existing one and
    // scale it. It's a hack, but without this I get weird behavious depending on the original draw
    // order of the people. The pattern also does not scale on the original person circle.
    let pattern = p.svg.image(imageSource("people", p.details.picture), tl.x, tl.y, mass, mass);
    let avatarBorder = p.svg.circle(pt.x, pt.y, p.radius);
    let avatar = avatarBorder.clone();
    let g = p.svg.group(pattern, avatarBorder);

    this.drawTitle();
    this.state = ShowState.Zooming;

    avatar.attr({fill: "#fff"});
    pattern.attr({mask: avatar});
    avatarBorder.attr({fillOpacity: 0,
                       stroke: "#888",
                       strokeWidth: (6 / scale)});

    g.click((e:MouseEvent) => p.show());
    g.hover((e:MouseEvent) => {},
            (e:MouseEvent) => {
              p.unhighlight();
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

  public finalize() : void {
    if (this.shown()) {
      this.title.animate({fillOpacity: 0}, 150, mina.linear, () => {
        this.title.remove();
      });
    }

    this.state = ShowState.Unhighlighted;
  }
}
