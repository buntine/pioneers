/// <reference path='year.ts'/>
/// <reference path='person.ts'/>

namespace Timeline {
    export class Timeline implements Structure.Tab {
        private people: Array<Timeline.Person>;
        private years: Array<Timeline.Year>;
        private columnSize: number;
        private id: number;
        private resolution: Structure.Resolution;

        public static TOP_PADDING = 5;
        public static MAX_ROW_SIZE = 150;
        private static MAX_FRAME_DIFF = 75; // Miliseconds.

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

        public execute(overlay = false): void {
            $("#impact_key").show();

            this.setResolution("High");
            this.drawScale();
            this.forAchievements((a, p) => a.drawHalo(this.columnSize)); // Halos must be all drawn before cores to prevent layering issues.
            this.forAchievements((a, p) => a.drawCore(this.columnSize, p));

            this.position(performance.now(), this.id, () => {
                if (overlay) {
                    Helpers.signalHighlightOverlays();
                }
            });
        }

        private position(ts: number, id: number, callback: () => void, iteration = 1): void {
            // Stop if this recursion is no longer active.
            if (this.id !== id) { return; }

            this.forAchievements((a, _) => a.position());

            // Approximation of iterations that's visually effective.
            if (this.resolution == "High" && iteration < (5.5 / Achievement.ATTRACTION_SPEED)) {
                requestAnimationFrame((next_ts: number) => {
                    // Performance is too bad, so use low-res mode.
                    if (iteration > 2 && (next_ts - ts) > Timeline.MAX_FRAME_DIFF) {
                        this.setResolution("Low");
                    }

                    this.position(next_ts, id, callback, iteration + 1)
                });
            } else {
                this.forAchievements((a, _) => a.snap());
                callback();
            }
        }

        public unfocus(): void {
            $("#impact_key").hide();
            $("#achievement_overlay").hide();

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
                    let achievement = new Achievement(a, this.svg);

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
            let lastYearIndex = this.years.length - 1;
            let dimensions = Helpers.canvasDimensions(this.svg);
            let scaleTop = this.svg.line(0, 1, dimensions.x, 1);
            let scaleBottom = this.svg.line(0, 31, dimensions.x, 31);
            let bg = this.svg.rect(0, 2, this.columnSize, 28);
            let year = this.svg.text(0, 20, this.years[lastYearIndex].year);
            let guideline = this.svg.line(0, 32, 0, dimensions.y);
            let g = this.svg.group(bg, year);
            let bbox = year.getBBox();

            guideline.attr({stroke: "#e81e48"});
            year.transform(`translateX(${Helpers.centerize(this.columnSize, bbox.w, 0)})`);
            year.attr({fill: "#fff", fontSize: "12px", fontFamily: "Share Tech Mono, arial"});
            bg.attr({fill: "#e81e48"});
            scaleTop.attr({stroke: "#fff"});
            scaleBottom.attr({stroke: "#fff"});

            // Move guideline so it's initial position is in the last (most recent) row.
            guideline.transform(`translateX(${Helpers.centerize(this.columnSize, 1, lastYearIndex)})`);
            g.transform(`translateX(${this.columnSize * lastYearIndex})`);

            this.svg.mousemove((e:MouseEvent) => {
                let i = Math.floor(e.clientX / this.columnSize);

                if (i >= 0 && i < this.years.length) {
                    let x = this.columnSize * i;

                    year.attr({text: this.years[i].year});
                    g.transform(`translateX(${x})`);
                    guideline.transform(`translateX(${Helpers.centerize(this.columnSize, 1, i)})`);
                }
            });
        }

        public setResolution(r: Structure.Resolution): void {
            this.resolution = r;
        }
    }
}
