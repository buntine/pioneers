namespace Timeline {
    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;

        private RADIUS_FACTOR = 0.056;
        private SPACING = 1.35;
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
            let radius = columnWidth * this.RADIUS_FACTOR;
            let coords = this.coords(columnWidth, radius);
            let halo = svg.circle(coords.x, coords.y, radius);
            let core = halo.clone();
            let fill = this.COLOURS[this.details.impact - 1];

            core.attr({fill: fill});
            halo.attr({fill: fill, opacity: 0.1});
            halo.animate({r: radius * this.details.impact}, (220 * this.details.impact), mina.easein);
        }

        public coords(columnWidth: number, radius: number): Vector {
            let x = (columnWidth * this.column) + ((columnWidth / 2) - radius / 2);
            let y = this.row * radius * this.COLOURS.length * this.SPACING;

            return new Vector(x, y);
        }
    }
}
 
