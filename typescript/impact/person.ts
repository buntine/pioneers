/// <reference path='../helpers.ts'/>
/// <reference path='../pioneer.ts'/>

namespace Impact {
    export class Person extends Pioneer {
        public title: Title;
        public avatar: Snap.Element;
        public radius: number;
        private initialPoint: Vector;
        private image: HTMLImageElement;

        public static MAX_ZOOM = 250;
        public static MAX_SIZE = 350;

        constructor(public svg: Snap.Paper, public details: Structure.Person, public point: Vector) {
            super();

            this.initialPoint = this.point.clone();
            this.title = new Title(this);
            this.image = new Image();
            this.image.src = Helpers.imageSource("people", this.details.picture);
        }

        public draw(unit: number): void {
            let mass = Math.round(Math.min(Person.MAX_SIZE, this.details.impact * unit));

            this.radius = mass / 2;

            let tl = this.topLeft();
            let pattern = this.svg.image(this.image.src, tl.x, tl.y, mass, mass);

            this.avatar = this.svg.circle(this.point.x, this.point.y, this.radius);
            this.avatar.attr({fill: pattern.pattern(tl.x, tl.y, mass, mass),
                              stroke: "#888",
                              strokeWidth: 1,
                              cursor: "pointer"});

            this.avatar.click((_: MouseEvent) => this.highlight());
            this.avatar.hover((_: MouseEvent) => this.highlight(),
                              // Only call unhighlight here if the zoomed in picture from Title is not covering this.avatar.
                              (_: MouseEvent) => { if (this.title.waiting()) { this.unhighlight() }});

            this.title.draw();
        }

        public position(): void {
            let v = Vector.sub(this.point, this.initialPoint);
            this.avatar.transform(`translate(${v.x}, ${v.y})`);
        }

        public reset(): void {
            this.point = this.initialPoint.clone();
        }

        public detract(p: Person, padding: number): void {
            let dist = this.point.distanceFrom(p.point);
            let radii = this.radius + p.radius + padding;

            // Overlapping, move away from each other.
            if (dist < radii) {
                let mid = (c: number) => { return (c / dist) * (radii - dist) * 0.5; };
                let v = Vector.sub(p.point, this.point);
                let tv = new Vector(mid(v.x), mid(v.y));

                this.point.sub(tv);
                p.point.add(tv);
            }
        }

        public attract(to: Vector, damping: number): void {
            let v = Vector.sub(this.point, to);
            v.mul(damping);

            this.point.sub(v);
        }

        public preloaded(): boolean {
            return this.image.complete && this.image.naturalHeight != 0;
        }

        public topLeft(): Vector {
            return Vector.sub(this.point, new Vector(this.radius, this.radius));
        }

        public highlight(): void {
            this.title.initiate()
            this.avatar.animate({strokeWidth: 6}, 690, mina.easein, () => {
                this.hide();
                this.title.zoom();
            });
        }

        public unhighlight(): void {
            this.avatar.stop().animate({strokeWidth: 1}, 300);
            this.unhide();
            this.title.finalize();
        }

        private hide(): void {
            this.avatar.attr({display: "none"});
        }

        private unhide(): void {
            this.avatar.attr({display: ""});
        }

    }
}
