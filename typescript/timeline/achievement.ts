namespace Timeline {
    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;

        private RADIUS: number = 9;
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

        public draw(columnWidth: number, person: Structure.Person, svg: Snap.Paper): void {
            let coords = this.coords(columnWidth);
            let core = svg.circle(coords.x, coords.y, this.RADIUS);
            let halo = svg.circle(coords.x, coords.y, this.RADIUS * this.details.impact);
            let fill = this.COLOURS[this.details.impact - 1];

            core.attr({fill: fill});
            halo.attr({fill: fill, opacity: 0.3});
        }

        public coords(columnWidth: number): Vector {
            let c = (axis: number, factor = 1) => ((columnWidth / factor) * axis) + ((columnWidth / (factor * 2)) - this.RADIUS / 2);

            return new Vector(c(this.column), c(this.row, 3));

        }
    }
}
 
