namespace Timeline {
    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;

        private RADIUS: number = 9;

        constructor(achievement: Structure.Achievement) {
            this.details = achievement;
            this.row = 0;
            this.column = 0;
        }

        public draw(columnWidth: number, person: Structure.Person, svg: Snap.Paper): void {
            let coords = this.coords(columnWidth);
            let core = svg.circle(coords.x, coords.y, this.RADIUS);
            let halo = svg.circle(coords.x, coords.y, this.RADIUS * this.details.impact);

            core.attr({fill: "green"});
            halo.attr({fill: "green", opacity: 0.3});
        }

        public coords(columnWidth: number): Vector {
            let c = (axis: number, factor = 1) => ((columnWidth / factor) * axis) + ((columnWidth / (factor * 2)) - this.RADIUS / 2);

            return new Vector(c(this.column), c(this.row, 3));

        }
    }
}
 
