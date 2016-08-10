/// <reference path='popper.ts'/>

namespace Timeline {
    enum ShowState {
        None = 0,
        Zooming = 1,
        Shown = 2,
    }

    export class Achievement {
        public details: Structure.Achievement;
        public row: number;
        public column: number;
        public state: ShowState;

        private core: Snap.Element;
        private halo: Snap.Element;
        private popper: Timeline.Popper;
        private destinationPoint: Vector;
        private currentPoint: Vector;
        private initialPoint: Vector;
        private radius: number;

        public static ATTRACTION_SPEED = 0.13;
        private static RADIUS_FACTOR = 0.125;
        private static MAX_RADIUS = 15;
        private static HALO_MULTIPLIER = 1.36;
        private static ANIMATE_SPEED = 350;

        public static COLOURS: Array<string> = [
            "#313c53",
            "#3f4d69",
            "#1b48a1",
            "#0677d8",
            "#00fffd",
        ];

        constructor(achievement: Structure.Achievement, public svg: Snap.Paper) {
            this.state = ShowState.None;
            this.details = achievement;
            this.popper = new Popper(svg);
            this.row = 0;
            this.column = 0;
        }

        public drawHalo(columnSize: number): void {
            this.radius = Math.min(Achievement.MAX_RADIUS, columnSize * Achievement.RADIUS_FACTOR);
            this.destinationPoint = this.coords(columnSize);

            this.halo = this.svg.circle(this.destinationPoint.x, this.destinationPoint.y, this.radius);
            this.halo.attr({fill: "none", borderWidth: 1, stroke: Achievement.COLOURS[1], opacity: 0});
        }

        public drawCore(columnSize: number, p: Timeline.Person): void {
            this.currentPoint = Vector.randomized(new Vector(0, 0), Helpers.canvasDimensions(this.svg));
            this.initialPoint = this.currentPoint.clone();

            this.core = this.svg.circle(this.initialPoint.x, this.initialPoint.y, this.radius);
            this.core.attr({fill: this.fill(), cursor: "pointer"});

            this.popper.draw(this.destinationPoint, this.haloRadius());

            this.core.hover((_: MouseEvent) => {
                let r = parseInt(this.halo.attr("r"));

                this.state = ShowState.Zooming;

                // If user lets animation complete, continue to show full achievement details.
                this.core.animate({r: r}, Achievement.ANIMATE_SPEED, mina.easeout, () => {
                    this.state = ShowState.Shown;
                    this.popper.expand(p, this);
                });
            },
            (_: MouseEvent) => {
                if (this.state == ShowState.Zooming) {
                    this.unfocus();
                }
            });
        }

        public position(damping = Achievement.ATTRACTION_SPEED): void {
            let v = Vector.sub(this.currentPoint, this.destinationPoint);

            v.mul(damping);
            this.currentPoint.sub(v);

            let p = Vector.sub(this.currentPoint, this.initialPoint);

            this.core.transform(`translate(${p.x}, ${p.y})`);
        }

        public snap(): void {
            // Snap to exact position.
            this.position(1);
            this.halo.animate({r: this.haloRadius(), opacity: 0.85}, (220 * this.details.impact), mina.easein);
        }

        public unfocus(): void {
            this.state = ShowState.None;
            this.core.stop().animate({r: this.radius}, Achievement.ANIMATE_SPEED * 0.75, mina.easein);
        }

        private fill(): string {
            return Achievement.COLOURS[this.details.impact - 1];
        }

        private haloRadius(): number {
            return this.radius * (this.details.impact * Achievement.HALO_MULTIPLIER);
        }

        private coords(columnSize: number): Vector {
            let c = (a: number, max = 99999) => Helpers.centerize(Math.min(max, columnSize), this.radius / 4, a);

            return new Vector(c(this.column),
                              c(this.row, Timeline.MAX_ROW_SIZE) + Helpers.headerOffset() + Timeline.TOP_PADDING);
        }
    }
}
