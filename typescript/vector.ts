enum Axis {
    X,
    Y,
    Both,
}

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

    public static randomized(low: Vector, high: Vector): Vector {
        return new Vector(low.x + ((Math.random() * high.x) - low.x),
                          low.y + ((Math.random() * high.y) - low.y));
    }

    public div(n: number): void {
        this.x /= n;
        this.y /= n;
    }

    public mag(axis = Axis.Both): number {
        let [x, y] = [this.x, this.y],
            total = 0;

        if (axis !== Axis.Y) {
            total += x * x;
        }

        if (axis !== Axis.X) {
            total += y * y;
        }

        return Math.sqrt(total);
    }

    public distanceFrom(v: Vector, axis = Axis.Both): number {
        let distance = Vector.sub(v, this);

        return distance.mag(axis);
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

    public isEmpty(): boolean {
        return (this.x === 0 && this.y === 0);
    }
}
