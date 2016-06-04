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
            let x = (columnWidth * this.column) + ((columnWidth / 2) - this.RADIUS / 2);
            let y = (columnWidth * this.row) + ((columnWidth / 2) - this.RADIUS / 2);
            let core = svg.circle(x, y, this.RADIUS);

            core.attr({fill: "green"});
        }
    }
}
 
