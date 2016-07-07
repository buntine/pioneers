namespace Timeline {
    export class Popper {
        private rect: Snap.Element;
        private point: Vector;
        private radius: number;

        constructor(public svg: Snap.Paper) { }

        // TODO: Use one rect and just show/hide it on "expand".

        public draw(point: Vector, r: number): void {
            this.point = point;
            this.radius = r;
            this.rect = this.svg.rect(point.x - r, point.y - r, r * 2, r * 2, r, r);
            this.rect.attr({fill: "#2b2b2b",
                            borderWidth: "1px",
                            stroke: Achievement.COLOURS[1],
                            display: "none"});
        }

        public expand(p: Timeline.Person, a: Structure.Achievement, onexit: () => void) {
            let r = this.radius;

            this.rect
                .attr({display: ""})
                .animate({rx: 3, ry: 3}, 220, mina.easein, () => {
                    this.rect.animate({height: 400, width: 300, x: this.point.x - 150}, 220, mina.easeout, () => {
                        this.show(p, a);
 
                        let f = (e: MouseEvent) => {
                            $("#achievement_overlay").hide();
    
                            this.rect.animate({height: r * 2, width: r * 2, x: this.point.x - r}, 220, mina.easein, () => {
                                this.rect.animate({rx: r, ry: r}, 220, mina.easeout, () => {
                                    this.rect.attr({display: "none"});
                                    onexit();
                                });
                            });
    
                            this.svg.unmouseover(f);
                        };
 
                        this.svg.mouseover(f);
                    });
            });
        }

        public show(p: Timeline.Person, a: Structure.Achievement): void {
            $.get("/static/templates/achievement.mst", (template: string) => {
                let rendered = Mustache.render(template, {
                    person: p.details, 
                    achievement: a, 
                    parseDescription: Helpers.parseDescription,
                });

                $("#achievement_overlay")
                    .html(rendered)
                    .css({top: this.point.y + 60 - this.radius, left: this.point.x - 150})
                    .show()
                    .find(".all_achievements")
                    .click((e: MouseEvent) => {
                        e.preventDefault();
                        // TODO: this.unfocus();
                        p.show();
                    });
            });
        }
    }
}
