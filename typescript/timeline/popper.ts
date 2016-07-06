namespace Timeline {
    export class Popper {
        constructor(public svg: Snap.Paper) { }

        public expand(p: Timeline.Person, a: Structure.Achievement, r: number, onexit: () => void) {
            this.pop = this.svg.rect(this.currentPoint.x - r, this.currentPoint.y - r, r * 2, r * 2, r, r);
            this.pop.attr({fill: "#2b2b2b", borderWidth: "1px", stroke: Achievement.COLOURS[1]});
            this.pop.animate({rx: 3, ry: 3}, 220, mina.easein, () => {
                this.pop.animate({height: 400, width: 300, x: this.currentPoint.x - 150}, 220, mina.easeout, () => {
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
        }

        public show(p: Timeline.Person, r: number): void {
            $.get("/static/templates/achievement.mst", (template: string) => {
                let rendered = Mustache.render(template, {
                    person: p.details, 
                    achievement: this.details, 
                    parseDescription: Helpers.parseDescription,
                });

                $("#achievement_overlay")
                    .html(rendered)
                    .css({top: this.destinationPoint.y + 60 - r, left: this.destinationPoint.x - 150})
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
