namespace Timeline {
    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;
        public element: Snap.Element;

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

        public draw(columnWidth: number, person: Structure.Person, svg: Snap.Paper): void {
            let radius = Math.min(this.MAX_RADIUS, columnWidth * this.RADIUS_FACTOR);
            let coords = this.coords(columnWidth, radius);
            let halo = svg.circle(coords.x, coords.y, radius);
            let core = halo.clone();
            let fill = this.COLOURS[this.details.impact - 1];

            this.element = svg.group(core, halo);

            core.attr({fill: fill});
            halo.attr({fill: fill, opacity: 0.1});
            halo.animate({r: radius * this.details.impact}, (220 * this.details.impact), mina.easein);
        }

        public coords(columnWidth: number, radius: number): Vector {
            let x = (columnWidth * this.column) + ((columnWidth / 2) - radius / 2) + 20;
            let y = (columnWidth * this.row) + ((columnWidth / 2) - radius / 2) + 50;

            return new Vector(x, y);
        }
    }
}
 
