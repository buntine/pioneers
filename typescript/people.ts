class People extends Array<Person> {
  private total:number;
  private center:Vector;
  public alive:boolean;

  private static MIN_REFINEMENT = 45;
  private static MAX_DELTA = 0.7;
  private static DAMPING_FACTOR = 0.25;
  private static REFINEMENT_DELTA = 8;
  private static REDRAW_THRESHOLD = 16;

  constructor(public svg:Snap.Paper) {
    super();

    let width = parseInt(svg.attr("width"));
    let height = parseInt(svg.attr("height"));

    this.center = new Vector(width / 2.0, height / 2.0);
    this.total = 0;
    this.alive = true;
  }

  private delta() : number {
    return (this.length == 1) ? People.MAX_DELTA : 1 + ((this.length - 1) * 0.07);
  }

  public push(p:Person) : number {
    this.total += p.details.impact;
    return super.push(p);
  }

  public position(iteration = 1) : void {
    let redraw = iteration % Math.ceil(this.length / People.REDRAW_THRESHOLD) == 0;

    // Sort from closest->furthest to center point.
    this.sort((a:Person, b:Person) => {
      let c = this.center;
      return a.distanceFrom(c) - b.distanceFrom(c);
    });

    // Detract other particles.
    for (let i=0;i<this.length;i++) {
      for (let n=i+1;n<this.length;n++) {
        this[i].detract(this[n], 9);
      }
    }

    // Attract to center point.
    for (let p of this) {
      p.attract(this.svg, this.center, People.DAMPING_FACTOR / iteration);

      if (redraw) {
        p.position(this.svg);
      }
    }

    // Refine.
    if (this.alive && iteration < Math.max(People.MIN_REFINEMENT, this.length * People.REFINEMENT_DELTA)) {
      setTimeout(() => {
        this.position(iteration + 1);
      }, redraw ? 15 : 0);
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
