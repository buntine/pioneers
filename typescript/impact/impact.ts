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
            let [w, h] = ["width", "height"].map(a => parseInt(this.svg.attr(a)));
            let [low, high] = [new Vector(150, 20),
                               new Vector(w, h - 20)];

            this.people.clear();

            set.forEach((p) => {
                this.people.push(
                    new Person(this.svg, p, Vector.randomized(low, high)));
            });

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
            $("#people_list").show();

            this.setResolution("High");
            this.people.pack();
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
