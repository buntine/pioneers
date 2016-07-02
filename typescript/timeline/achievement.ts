namespace Timeline {
    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;

        private core: Snap.Element;
        private halo: Snap.Element;
        private destinationPoint: Vector;
        private currentPoint: Vector;
        private initialPoint: Vector;

        public static ATTRACTION_SPEED = 0.13;
        private static RADIUS_FACTOR = 0.256;
        private static MAX_RADIUS = 15;
        private static COLOURS: Array<string> = [
            "#7336a8",
            "#4a8cdb",
            "#ed5f55",
            "#f8e71c",
            "#00ffe6",
        ];

        constructor(achievement: Structure.Achievement) {
            this.details = achievement;
            this.row = 0;
            this.column = 0;
        }

        public drawHalo(columnSize: number, svg: Snap.Paper): void {
            let radius = this.radius(columnSize);

            this.destinationPoint = this.coords(columnSize, radius);

            this.halo = svg.circle(this.destinationPoint.x, this.destinationPoint.y, radius);
            this.halo.attr({fill: this.fill(), opacity: 0});
        }

        public drawCore(columnSize: number, person: Timeline.Person, svg: Snap.Paper): void {
            let [w, h] = ["width", "height"].map(a => parseInt(svg.attr(a)));

            this.currentPoint = Vector.randomized(new Vector(0, 0), new Vector(w, h));
            this.initialPoint = this.currentPoint.clone();

            this.core = svg.circle(this.initialPoint.x, this.initialPoint.y, this.radius(columnSize));
            this.core.mouseover((e:MouseEvent) => console.log(person.details.name));
            this.core.attr({fill: this.fill()});
        }

        public position(damping = Achievement.ATTRACTION_SPEED): void {
            let v = Vector.sub(this.currentPoint, this.destinationPoint);

            v.mul(damping);
            this.currentPoint.sub(v);

            let p = Vector.sub(this.currentPoint, this.initialPoint);

            this.core.transform(`translate(${p.x}, ${p.y})`);
        }

        public snap(): void {
            let radius = parseInt(this.halo.attr("r"));

            this.position(1); // Snap to exact position.
            this.halo.animate({r: radius * this.details.impact, opacity: 0.1}, (220 * this.details.impact), mina.easein);
        }

        public coords(columnSize: number, radius: number): Vector {
            let c = (a:number) => Helpers.centerize(columnSize, radius, a);

            return new Vector(c(this.column), c(this.row) + Timeline.TOP_PADDING);
        }

        private fill(): string {
            return Achievement.COLOURS[this.details.impact - 1];
        }

        private radius(columnSize: number) {
            return Math.min(Achievement.MAX_RADIUS, columnSize * Achievement.RADIUS_FACTOR);
        }
    }
}
