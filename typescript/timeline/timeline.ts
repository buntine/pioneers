/// <reference path='year.ts'/>
/// <reference path='person.ts'/>

namespace Timeline {
    export class Timeline implements Structure.Tab {
        private people: Array<Timeline.Person>;
        private years: Array<Timeline.Year>;
        private columnWidth: number;

        constructor(public svg: Snap.Paper) {
            this.columnWidth = 100;
            this.years = [];
            this.people = [];
            this.reset();
        }

        public build(set: Array<Structure.Person>): boolean {
            this.reset();

            let years = this.buildPeople(set);
            this.years = Object.keys(years)
                               .map((k: string) => years[parseInt(k)])
                               .sort((a, b) => a.year - b.year);

            // Set Y-axis position for each achievement based on where 'a.year' sits in sorted array of years.
            // This is not good. But it's not O(n^3) despite the nested loops.
            return this.forAchievements((a, p) => {
                for (let i = 0; i < this.years.length; i++) {
                    if (this.years[i].year == a.details.year) {
                        a.column = i;
                        return true;
                    }
                }

                return false;
            });
        }

        public execute(): boolean {
            if (this.built()) {
                return this.forAchievements((a, p) => a.draw(this.columnWidth, p.details, this.svg), false);
            } else {
                return false;
            }
        }

        public unfocus(): void {
            this.svg.clear();
        }

        public resize(): void {
            let [width, height] = [$(window).width(), $(window).height() - $("#datacanvas").offset().top];
            
            this.columnWidth = (width - 20) / this.years.length;

            this.svg.attr({width: width, height: height});
        }

        public built(): boolean {
            return this.people.length > 0;
        }

        private forAchievements(f: (a: Achievement, p: Person) => void, ensureTrue = true): boolean {
            for (let p of this.people) {
                for (let a of p.achievements) {
                    if (!f(a, p) && ensureTrue) {
                        return false;
                    }
                }
            }

            return true;
        }

        private reset(): void {
            this.years = [];
            this.people = [];
        }

        private buildPeople(set: Array<Structure.Person>): {[K: number]: Timeline.Year} {
            // Temporarily store as a map to allow for faster lookups.
            let years: {[K: number]: Timeline.Year} = {};

            for (let p of set) {
                let person = new Person(p);

                for (let a of p.achievements) {
                    let achievement = new Achievement(a);

                    achievement.row = this.rowFor(years, a.year);
                    person.achievements.push(achievement);
                }

                this.people.push(person);
            }

            return years;
        }

        private rowFor(years: {[K: number]: Timeline.Year}, year: number): number {
            if (years[year] == undefined) {
                years[year] = new Year(year);
            } else {
                years[year].inc();
            }

            return years[year].count;
        }
    }
}
