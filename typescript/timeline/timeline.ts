/// <reference path='year.ts'/>
/// <reference path='person.ts'/>

namespace Timeline {
    export class Timeline implements Structure.Tab {
        private people: Array<Timeline.Person>;
        private years: Array<Timeline.Year>;
        private columnSize: number;
        private id: number;
        private resolution: Structure.Resolution;

        public static TOP_PADDING = 80;

        constructor(public svg: Snap.Paper) {
            this.columnSize = 100;
            this.id = 0;
            this.years = [];
            this.people = [];
            this.resolution = "High";

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
            }, true);
        }

        public preload(callback: () => void, iteration = 1) {
            // No preload required. Move along, nothing to see here.
            callback();
        }

        public execute(): void {
            this.drawScale();
            this.forAchievements((a, p) => a.drawHalo(this.columnSize, this.svg)); // Halos must be all drawm before cores to prevent layering issues.
            this.forAchievements((a, p) => a.drawCore(this.columnSize, p, this.svg));

            this.position(this.id);
        }

        private position(id: number, iteration = 1): void {
            // Stop if this recursion is no longer active.
            if (this.id !== id) { return; }

            let snapAll = () => this.forAchievements((a, p) => a.snap());

            if (this.resolution == "High") {
                this.forAchievements((a, p) => a.position());

                // Approximation of iterations that's visually effective.
                if (iteration < (5.5 / Achievement.ATTRACTION_SPEED)) {
                    requestAnimationFrame(() => this.position(id, iteration + 1));
                } else {
                    snapAll();
                }
            } else {
                snapAll();
            }
        }

        public unfocus(): void {
            // Cheap way for me to kill obsolete recursions on this.position() when user is actively resizing window.
            this.id++;
        }

        public resize(w: number, h: number): void {
            this.columnSize = w / this.years.length;
        }

        public built(): boolean {
            return this.people.length > 0;
        }

        private forAchievements(f: (a: Achievement, p: Person) => void, ensureTrue = false): boolean {
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

        private drawScale() {
            let width = parseInt(this.svg.attr("width"));
            let scaleTop = this.svg.line(0, 1, width, 1);
            let scaleBottom = this.svg.line(0, 31, width, 31);
            let year = this.svg.text(0, 20, this.years[0].year);
            let g = this.svg.group(year); // GO

            year.attr({fill: "#ffffff", fontSize: "0.9em", fontFamily: "Share Tech Mono, arial"});
            scaleTop.attr({stroke: "#ffffff"});
            scaleBottom.attr({stroke: "#ffffff"});

            this.svg.mousemove((e:MouseEvent) => {
              let x = Math.min(e.clientX, width);
              let i = Math.floor(e.clientX / this.columnSize);

              if (i >= 0 && i < this.years.length) {
                  year.attr({text: this.years[i].year});
                  g.transform(`translate(${x},0)`);
              }
            });
        }

        public setResolution(r: Structure.Resolution): void {
            this.resolution = r;
        }
    }
}
