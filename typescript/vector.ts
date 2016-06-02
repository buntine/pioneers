class Vector {
    constructor(public x: number, public y: number) {}

    public add(v: Vector): void {
        this.x += v.x;
        this.y += v.y;
    }

    public mul(n: number): void {
        this.x *= n;
        this.y *= n;
    }

    public sub(v: Vector): void {
        this.x -= v.x;
        this.y -= v.y;
    }

    public static sub(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    public static randomized(x: number, y: number): Vector {
        return new Vector(Math.random() * x, Math.random() * y);
    }

    public div(n: number): void {
        this.x /= n;
        this.y /= n;
    }

    public mag(): number {
        let [x, y] = [this.x, this.y];

        return Math.sqrt(x * x + y * y);
    }

    public distanceFrom(v: Vector): number {
        let distance = Vector.sub(v, this);

        return distance.mag();
    }

    public normalize(): void {
        let m = this.mag();

        if (m != 0) {
            this.div(m);
        }
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }
}

