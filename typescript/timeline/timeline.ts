/// <reference path='year.ts'/>
/// <reference path='person.ts'/>

namespace Timeline {
    export class Timeline implements Structure.Tab {
        private people: Array<Timeline.Person>;
        private years: {[K: number]: number}
        private yearWidth: number;

        private static YEARS_ON_SCREEN = 9;

        constructor(public svg: Snap.Paper) {
            this.yearWidth = 100;
            this.reset();
        }

        public build(set: Array<Structure.Person>): boolean {
            this.reset();
            this.buildPeople(set);

            let allYears = Object.keys(this.years)
                                 .map((k:string) => parseInt(k))
                                 .sort((a, b) => a - b);

            // Set Y-axis position for each achievement based on where 'a.year' sits in sorted array of years.
            for (let p of this.people) {
                for (let a of p.achievements) {
                    a.column = allYears.indexOf(a.details.year);
                }
            }

            return true;
        }

        public execute(): boolean {
            if (this.built()) {
                for (let p of this.people) {
                    for (let a of p.achievements) {
                        a.draw(p.details, this.svg);
                    }
                }

                return true;
            } else {
                return false;
            }
        }

        public unfocus(): void {
            this.svg.clear();
        }

        public resize(): void {
            let [width, height] = [$(window).width(), $(window).height() - $("#impactcanvas").offset().top];
            
            this.yearWidth = width / Timeline.YEARS_ON_SCREEN;

            this.svg.attr({width: width, height: height});
        }

        public built(): boolean {
            return this.people.length > 0;
        }

        private reset(): void {
            this.years = [];
            this.people = [];
        }

        private buildPeople(set: Array<Structure.Person>): void {
            for (let p of set) {
                let person = new Person(p);

                for (let a of p.achievements) {
                    let achievement = new Achievement(a);

                    achievement.row = this.rowFor(a.year);
                    person.achievements.push(achievement);
                }

                this.people.push(person);
            }
        }

        private rowFor(year: number): number {
            if (this.years[year] == undefined) {
                this.years[year] = 0;
            } else {
                this.years[year] += 1;
            }

            return this.years[year];
        }
    }
}
