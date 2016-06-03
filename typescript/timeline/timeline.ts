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
            this.years = [];
            this.people = [];
        }

        public build(set: Array<Structure.Person>): boolean {
            this.years = [];
            this.people = [];

            for (let p of set) {
                let person = new Person(p);

                for (let a of p.achievements) {
                    let achievement = new Achievement(a);

                    if (this.years[a.year] == undefined) {
                        this.years[a.year] = 0;
                    } else {
                        this.years[a.year] += 1;
                    }

                    achievement.row = this.years[a.year];

                    person.achievements.push(achievement);
                }

                this.people.push(person);
            }

            let allYears = Object.keys(this.years)
                                 .map((k:string, i:number) => parseInt(k))
                                 .sort((a,b) => a - b);

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
    }
}
