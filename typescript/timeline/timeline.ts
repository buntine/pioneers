/// <reference path='year.ts'/>
//
namespace Timeline {
    export class Timeline implements Structure.Tab {
        private people: Array<Structure.Person>;
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
 
            return true;
        }

        public execute(): boolean {
            if (this.built()) {
                for (let y of this.years) {
                    y.draw(this.svg);
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
