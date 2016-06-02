/// <reference path='year.ts'/>
/// <reference path='person.ts'/>

namespace Timeline {
    export class Timeline implements Structure.Tab {
        private people: Array<Timeline.Person>;
        private years: Array<Timeline.Year>;
        private yearWidth: number;

        private static YEARS_ON_SCREEN = 9;

        constructor(public svg: Snap.Paper) {
            this.yearWidth = 100;
            this.years = [];
            this.people = [];
        }

        public build(set: Array<Structure.Person>): boolean {
            // Translate "set" into something usable.
            //   this.people = [{name: "Tom Jones", dob: 1920, etc} ...]
            //   this.years = [{year: 1929, achievements: [{impact: 5, description: "Something", source: "x.com", person_id: 1, ...], ...]
 
            // Run through all set, build array of Years [1990, 1992, 2001] and count of achievements in each year.
            // Run through again, annotate each achievement with row (offset year) and col (number in same year).

            return true;
        }

        public execute(): boolean {
            if (this.built()) {
                for (let p of this.people) {
                    for (let a of p.achievements) {
                        a.draw(this.svg);
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
            return true;
        }
    }
}
