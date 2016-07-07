namespace Timeline {
    export class Popper {
        private rect: Snap.Element;
        private point: Vector;
        private radius: number;

        private static WIDTH = 300;
        private static HEIGHT = 400;
        private static SPEED = 220;

        constructor(public svg: Snap.Paper) { }

        public draw(point: Vector, r: number): void {
            this.point = point;
            this.radius = r;
            this.rect = this.svg.rect(point.x - r, point.y - r, r * 2, r * 2, r, r);
            this.rect.attr({fill: "#2b2b2b",
                            borderWidth: "1px",
                            stroke: Achievement.COLOURS[1],
                            display: "none"});
        }

        public expand(p: Timeline.Person, a: Timeline.Achievement) {
            let [w, h] = [Popper.WIDTH, Popper.HEIGHT];

            this.rect
                .attr({display: ""})
                .animate({rx: 3, ry: 3}, Popper.SPEED, mina.easein, () => {
                    this.rect.animate({height: h, width: w, x: this.point.x - (w / 2)}, Popper.SPEED, mina.easeout, () => {
                        this.show(p, a);
 
                        let f = (e: MouseEvent) => {
                            this.unfocus(a);
                            this.svg.unmouseover(f);
                        };
 
                        this.svg.mouseover(f);
                    });
            });
        }

        public show(p: Timeline.Person, a: Timeline.Achievement): void {
            $.get("/static/templates/achievement.mst", (template: string) => {
                let rendered = Mustache.render(template, {
                    person: p.details, 
                    achievement: a.details, 
                    parseDescription: Helpers.parseDescription,
                });

                $("#achievement_overlay")
                    .html(rendered)
                    .css({top: this.point.y + 60 - this.radius, left: this.point.x - 150})
                    .show()
                    .find(".all_achievements")
                    .click((e: MouseEvent) => {
                        e.preventDefault();
                        this.unfocus(a);
                        p.show();
                    });
            });
        }

        private unfocus(a: Timeline.Achievement): void {
            let r = this.radius

            $("#achievement_overlay").hide();
    
            this.rect.animate({height: r * 2, width: r * 2, x: this.point.x - r}, Popper.SPEED, mina.easein, () => {
                this.rect.animate({rx: r, ry: r}, Popper.SPEED, mina.easeout, () => {
                    this.rect.attr({display: "none"});
                    a.unfocus();
                });
            });
        }
    }
}
