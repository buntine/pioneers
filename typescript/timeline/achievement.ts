namespace Timeline {
    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;
        public element: Snap.Element;

        private core: Snap.Element;
        private halo: Snap.Element;
        private destination_point: Vector;
        private initial_point: Vector;

        private RADIUS_FACTOR = 0.256;
        private MAX_RADIUS = 15;
        private COLOURS: Array<string> = [
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
            let radius = Math.min(this.MAX_RADIUS, columnSize * this.RADIUS_FACTOR);
            let fill = this.COLOURS[this.details.impact - 1];

            this.destination_point = this.coords(columnSize, radius);
            this.initial_point = this.coords(columnSize, radius);

            this.halo = svg.circle(this.initial_point.x, this.initial_point.y, radius);
            this.core = this.halo.clone();
            this.element = svg.group(this.core, this.halo);

            this.core.attr({fill: fill});
            this.halo.attr({fill: fill, opacity: 0.1});
        }

        public position(): void {
            this.initial_point.add(new Vector(4, 4));
            this.element.transform(`translate(${this.initial_point.x}, ${this.initial_point.y})`);
        }

        private drawHalo(): void {
            let radius = parseInt(this.halo.attr("radius"));
            this.halo.animate({r: radius * this.details.impact}, (220 * this.details.impact), mina.easein);
        }

        public coords(columnSize: number, radius: number): Vector {
            let padding = Timeline.PADDING;
            let c = (a:number, p:number) => (columnSize * a) + ((columnSize / 2) - radius / 2) + padding[p];

            return new Vector(c(this.column, 1), c(this.row, 0));
        }
    }
}
 
