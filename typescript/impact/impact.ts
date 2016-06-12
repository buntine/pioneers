/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='title.ts'/>
/// <reference path='../vector.ts'/>

namespace Impact {
    export class Impact implements Structure.Tab {
        public people: Impact.People;

        private static PRELOAD_INTERVAL: number = 100;

        constructor(public svg: Snap.Paper) {
            this.people = new People();
        }

        public build(set: Array<Structure.Person>) : boolean {
            let [w, h] = ["width", "height"].map(a => parseInt(this.svg.attr(a)));

            this.people.clear();

            for (let p of set) {
                this.people.push(new Person(this.svg, p, Vector.randomized(w, h)));
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

        public execute(): void {
            this.people.pack();
        }

        public unfocus(): void {
            this.people.reset();
            this.svg.clear();
        }

        public resize(): void {
            let [width, height] = [$(window).width(), $(window).height() - $("#datacanvas").offset().top];

            this.people.centerize(width, height);
            this.svg.attr({width: width, height: height});
        }

        public built(): boolean {
            return this.people.length > 0;
        }
    }
}
