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
        private destinationPoint: Vector;
        private currentPoint: Vector;
        private initialPoint: Vector;

        public static ATTRACTION_SPEED = 0.13;
        private static RADIUS_FACTOR = 0.125;
        private static MAX_RADIUS = 15;
        private static HALO_MULTIPLIER = 1.36;

        private static COLOURS: Array<string> = [
            "#313c53",
            "#3f4d69",
            "#1b48a1",
            "#0677d8",
            "#00fffd",
        ];

        constructor(achievement: Structure.Achievement, public svg: Snap.Paper) {
            this.state = ShowState.None;
            this.details = achievement;
            this.row = 0;
            this.column = 0;
        }

        public drawHalo(columnSize: number): void {
            let radius = this.radius(columnSize);

            this.destinationPoint = this.coords(columnSize, radius);

            this.halo = this.svg.circle(this.destinationPoint.x, this.destinationPoint.y, radius);
            this.halo.attr({fill: "none", borderWidth: 1, stroke: Achievement.COLOURS[1], opacity: 0});
        }

        public drawCore(columnSize: number, p: Timeline.Person): void {
            let [w, h] = ["width", "height"].map(a => parseInt(this.svg.attr(a)));
            let radius = this.radius(columnSize);

            this.currentPoint = Vector.randomized(new Vector(0, 0), new Vector(w, h));
            this.initialPoint = this.currentPoint.clone();

            this.core = this.svg.circle(this.initialPoint.x, this.initialPoint.y, radius);
            this.core.attr({fill: this.fill(), cursor: "pointer"});

            this.core.hover((_: MouseEvent) => {
                let r = parseInt(this.halo.attr("r"));

                this.state = ShowState.Zooming;

                this.core.animate({r: r}, 700, mina.easeout, () => {
                    this.state = ShowState.Shown;

                    let pop = this.svg.rect(this.currentPoint.x - r, this.currentPoint.y - r, r * 2, r * 2, r, r);
                    pop.attr({fill: "#2b2b2b", borderWidth: "1px", stroke: Achievement.COLOURS[1]});
                    pop.animate({rx: 3, ry: 3}, 220, mina.easein, () => {
                        pop.animate({height: 400, width: 300, x: this.currentPoint.x - 150}, 220, mina.easeout, () => {
                            this.show(p, r);

                            let f = (e: MouseEvent) => {
                                $("#achievement_overlay").hide();

                                pop.animate({height: r * 2, width: r * 2, x: this.currentPoint.x - r}, 220, mina.easein, () => {
                                    pop.animate({rx: r, ry: r}, 220, mina.easeout, () => {
                                        pop.remove();
                                        this.state = ShowState.None;
                                        this.core.stop().animate({r: radius}, 300, mina.easein);
                                    });
                                });

                                this.svg.unmouseover(f);
                            };

                            this.svg.mouseover(f);
                        });
                    });
                });
            },
            (_: MouseEvent) => {
                if (this.state == ShowState.Zooming) {
                    this.state = ShowState.None;
                    this.core.stop().animate({r: radius}, 300, mina.easein);
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
            let radius = parseInt(this.halo.attr("r"));
            let haloRadius = radius * (this.details.impact * Achievement.HALO_MULTIPLIER);

            // Snap to exact position.
            this.position(1);
            this.halo.animate({r: haloRadius, opacity: 0.85}, (220 * this.details.impact), mina.easein);
        }

        public show(p: Timeline.Person, r: number): void {
            $.get("/static/templates/achievement.mst", (template: string) => {
                let rendered = Mustache.render(template, {
                    person: p.details, 
                    achievement: this.details, 
                    parseDescription: Helpers.parseDescription,
                    remainingAchievements: () => { return p.details.total_achievements - p.details.achievements.length },
                });

                $("#achievement_overlay")
                    .html(rendered)
                    .css({top: this.destinationPoint.y + 60 - r, left: this.destinationPoint.x - 150})
                    .show();
            });
        }

        private fill(): string {
            return Achievement.COLOURS[this.details.impact - 1];
        }

        private coords(columnSize: number, radius: number): Vector {
            let c = (a: number, max = 99999) => Helpers.centerize(Math.min(max, columnSize), radius / 4, a);

            return new Vector(c(this.column),
                              c(this.row, Timeline.MAX_ROW_SIZE) + Timeline.TOP_PADDING);
        }

        private radius(columnSize: number) {
            return Math.min(Achievement.MAX_RADIUS, columnSize * Achievement.RADIUS_FACTOR);
        }
    }
}
