namespace Timeline {
    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;
        public element: Snap.Element;

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

        public draw(columnSize: number, person: Structure.Person, svg: Snap.Paper): void {
            let radius = Math.min(Achievement.MAX_RADIUS, columnSize * Achievement.RADIUS_FACTOR);
            let fill = Achievement.COLOURS[this.details.impact - 1];
            let [w, h] = ["width", "height"].map(a => parseInt(svg.attr(a)));

            this.destinationPoint = this.coords(columnSize, radius);
            this.currentPoint = Vector.randomized(w, h);
            this.initialPoint = this.currentPoint.clone();

            this.halo = svg.circle(this.currentPoint.x, this.currentPoint.y, radius);
            this.core = this.halo.clone();
            this.element = svg.group(this.core, this.halo);

            this.core.attr({fill: fill});
            this.halo.attr({fill: fill, opacity: 0.1});
        }

        public position(damping = Achievement.ATTRACTION_SPEED): void {
            let v = Vector.sub(this.currentPoint, this.destinationPoint);

            v.mul(damping);
            this.currentPoint.sub(v);

            let p = Vector.sub(this.currentPoint, this.initialPoint);

            this.element.transform(`translate(${p.x}, ${p.y})`);
        }

        public snap(): void {
            let radius = parseInt(this.halo.attr("r"));

            this.position(1); // Snap to exact position.
            this.halo.animate({r: radius * this.details.impact}, (220 * this.details.impact), mina.easein);
        }

        public coords(columnSize: number, radius: number): Vector {
            let padding = Timeline.PADDING;
            let c = (a:number, p:number) => (columnSize * a) + ((columnSize / 2) - radius / 2) + padding[p];

            return new Vector(c(this.column, 1), c(this.row, 0));
        }
    }
}
