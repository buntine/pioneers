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
    return (this.length == 1) ? 0.7 : 1 + ((this.length - 1) * 0.07);
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
        this[i].detract(this[n], 10);
      }
    }

    // Attract to center point.
    for (let p of this) {
      p.attract(this.svg, this.center, 0.25 / iteration);
      p.position(this.svg);
    }

    // Refine.
    if (iteration < Math.max(45, this.length * 8)) {
      setTimeout(() => {
        this.position(iteration + 1);
      }, 15);
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