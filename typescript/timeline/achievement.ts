namespace Timeline {
    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;

        constructor(achievement: Structure.Achievement) {
            this.details = achievement;
            this.row = 0;
            this.column = 0;
        }

        public draw(person: Structure.Person, svg: Snap.Paper): void {
            console.log(`${person.name}, ${this.details.year}, ${this.row}`);
        }
    }
}
 
