class Vector {
  constructor(public x: number, public y: number) {}

  public add(v: Vector) : void {
    this.x += v.x;
    this.y += v.y;
  }

  public mul(n: number) : void {
    this.x *= n;
    this.y *= n;
  }

  public sub(v: Vector) : void {
    this.x -= v.x;
    this.y -= v.y;
  }

  public div(n: number) : void {
    this.x /= n;
    this.y /= n;
  }

  public mag() : number {
    let [x, y] = [this.x, this.y];

    return Math.sqrt(x * x + y * y);
  }

  public normalize() : void {
    let m = this.mag();

    if (m != 0) {
      this.div(m);
    }
  }
}

