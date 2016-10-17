/// <reference path='../structure/resolution.ts'/>

namespace Impact {
    export class People extends Array<Person> {
        private totalImpact: number;
        private center: Vector;
        public alive: boolean;
        public resolution: Structure.Resolution;

        private static MIN_REFINEMENT = 50;
        private static MAX_DELTA = 0.7;
        private static DAMPING_FACTOR = 0.25;
        private static REFINEMENT_DELTA = 4;
        private static REDRAW_THRESHOLD = 35;
        private static SIZING_DELTA = 0.057;
        private static MAX_FRAME_DIFF = 75; // Miliseconds.

        constructor() {
            super();

            this.resolution = "High";
            this.totalImpact = 0;
            this.alive = true;
        }

        public centerize(width: number, height: number): void {
            this.center = new Vector(width / 2.0, height / 2.0);
        }

        public push(p: Person): number {
            this.totalImpact += p.details.impact;
            return super.push(p);
        }

        public pack(callback: () => void): void {
            let [w, h] = [this.center.x * 2, this.center.y * 2]
            let unit = Math.min(w / this.totalImpact, h / this.totalImpact) * this.delta();

            this.alive = true;

            for (let p of this) {
                p.draw(unit);
            }

            this.position(performance.now(), callback);
        }

        public reset(): void {
            this.alive = false;

            for (let p of this) {
                p.reset();
            }
        }

        public clear(): void {
            this.alive = false;
            this.totalImpact = 0;
            this.length = 0;
        }

        private position(ts: number, callback: () => void, iteration = 1): void {
            if (!this.alive) { return; }

            let redraw: boolean;
            let iterations = Math.max(People.MIN_REFINEMENT, this.length * People.REFINEMENT_DELTA);

            if (this.resolution == "High") {
                redraw = iteration % Math.ceil(this.length / People.REDRAW_THRESHOLD) == 0;
            } else {
                redraw = iteration == iterations;
            }

            // Sort from closest->furthest to center point.
            this.sort((a: Person, b: Person) => {
                let c = this.center;
                return a.point.distanceFrom(c) - b.point.distanceFrom(c);
            });

            // Detract other particles.
            for (let i=0;i<this.length;i++) {
                for (let n=i+1;n<this.length;n++) {
                    this[i].detract(this[n]);
                }
            }

            // Attract to center point.
            for (let p of this) {
                p.attract(this.center, People.DAMPING_FACTOR / iteration);

                if (redraw) {
                    p.position();
                }
            }

            // Refine.
            if (iteration < iterations) {
                Helpers.onHighRes(this.resolution, (next_ts: number) => {
                    // Performance is too bad, so use low-res mode.
                    if (iteration > 2 && (next_ts - ts) > People.MAX_FRAME_DIFF) {
                        this.resolution = "Low";
                    }

                    this.position(next_ts, callback, iteration + 1)
                });
            // Reposition people who've been pushed too far off-screen.
            } else {
                let pToMove = this.filter((p) => p.offScreen());
                let offset = 0;

                for (let p of pToMove) {
                    p.recenter(offset);
                    p.moveTo(this.findClosestTo(p));
                    p.position();

                    offset += (p.radius * 2) + p.padding;
                }

                callback();
            }
        }

        public closestToCenter(): Person {
            return this[0];
        }

        private findClosestTo(person: Person): Person {
            let closest = this[0],
                point = person.point;

            for (let p of this) {
               // We only want to find the closest person that is collidable on the Y axis.
               if (person.collidingOn(p, Axis.Y) &&
                   person.details.id != p.details.id &&
                   point.distanceFrom(p.point) < point.distanceFrom(closest.point)) {
                   closest = p;
               }
            }

            return closest;
        }
 
        private delta(): number {
            return (this.length == 1) ? People.MAX_DELTA : 1 + ((this.length - 1) * People.SIZING_DELTA);
        }
    }
}
