/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='title.ts'/>
/// <reference path='../vector.ts'/>

namespace Impact {
    export class Impact implements Structure.Tab {
        public people: Impact.People;

        private static PRELOAD_INTERVAL = 100;

        constructor(public svg: Snap.Paper) {
            this.people = new People();
        }

        public build(set: Array<Structure.Person>) : boolean {
            let thresholds: [number, number] = [999, 0],
                canvas = Vector.sub(Helpers.canvasDimensions(this.svg),
                                    new Vector(0, 20));

            this.people.clear();

            set.forEach((p) => {
                let randomPosition = Vector.randomized(new Vector(150, 20), canvas),
                    impact = p.impact;

                this.people.push(
                    new Person(this.svg, p, randomPosition));

                if (impact < thresholds[0]) {
                    thresholds[0] = impact;
                } else if (impact > thresholds[1]) {	
                    thresholds[1] = impact;
                }
            });

            // Set padding now that we know the min/max impacts. Smaller people
            // should be packed closer together.
            if (thresholds[0] !== thresholds[1]) {
                this.people.forEach((p) => p.normalizePadding(thresholds));
            }

            return this.built();
        }

        public preload(callback: () => void, iteration = 1): void {
            // Wait up to 6 seconds for images to load.
            if (iteration < 60) {
                for (let p of this.people) {
                    if (!p.preloaded()) {
                        setTimeout(() => this.preload(callback, iteration + 1), Impact.PRELOAD_INTERVAL);
                        return;
                    }
                }
            }

            callback();
        }

        public execute(overlay = false): void {
            $("#people_list").show();

            this.setResolution("High");
            this.people.pack(() => {
                if (overlay) {
                    let toHighlight = this.people.closestToCenter();
                    let pioneerHighlight = $("#pioneer_highlight_overlay");
                    let v = toHighlight.bottomRight();
                    let y = (v.y - (pioneerHighlight.height() / 2) - toHighlight.radius) + Helpers.headerOffset();

                    pioneerHighlight.css({
                        top: y,
                        left: v.x + 31,
                    });

                    $(".highlight_overlay").animate({
                        opacity: 1,
                    }, 700);

                    setTimeout(() => {
                        $(".highlight_overlay").animate({
                            opacity: 0,
                        }, 700);
                    }, 6000);
                }
            });
        }

        public unfocus(): void {
            this.people.reset();

            $("#people_list").hide();
            $("#people_list ul").empty();
        }

        public resize(w: number, h: number): void {
            this.people.centerize(w, h);
        }

        public built(): boolean {
            return this.people.length > 0;
        }

        public setResolution(r: Structure.Resolution): void {
            this.people.resolution = r;
        }
    }
}
