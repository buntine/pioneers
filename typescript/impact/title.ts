/// <reference path='../helpers.ts'/>

namespace Impact {

    enum ShowState {
        None = 0,
        Waiting = 1,
        Zooming = 2,
    }

    export class Title {
        public state: ShowState;
        public group: Snap.Element;
        public title: any; // Zepto object.

        private static WAIT = 600;

        constructor(public person: Person) {
            this.state = ShowState.None;
        }

        public waiting(): boolean {
            return this.state < ShowState.Zooming;
        }

        public shown(): boolean {
            return this.state >= ShowState.Zooming;
        }

        public initiate(): void {
            this.state = ShowState.Waiting;

            let distance = this.distanceFromView();

            if (distance != 0) {
                this.doScroll(distance / 9);
            }

            this.highlight();

            setTimeout(() => this.zoom(), Title.WAIT);
        }

        public draw(): void {
            let p = this.person;

            this.title = $(`<li><a href="#">${p.details.name}</a></li>`);
            this.title.find("a")
                      .on("mouseenter", (_:MouseEvent) => this.person.highlight())
                      .on("mouseleave", (_:MouseEvent) => this.andClose())
                      .on("click", (_:MouseEvent) => this.andClose(() => this.person.show()));

            $("#people_list ul").append(this.title);
        }

        public zoom(): void {
            if (this.state != ShowState.Waiting) { return; }

            let p = this.person;
            let mass = p.radius * 2;
            let scale = Person.MAX_ZOOM / mass;
            let pt = p.point;
            let tl = p.topLeft();
            let dimensions = Helpers.canvasDimensions(p.svg);

            // In order to get zoom appearing correctly I need to draw new image over the existing one and
            // scale it. It's a hack, but without this I get weird behaviour depending on the original draw
            // order of the people. The pattern also does not scale on the original person circle.
            let pattern = p.svg.image(Helpers.imageSource("people", p.details.picture), tl.x, tl.y, mass, mass);
            let avatarBorder = p.svg.circle(pt.x, pt.y, p.radius);
            let avatar = avatarBorder.clone();

            this.group = p.svg.group(pattern, avatarBorder);
            this.state = ShowState.Zooming;

            this.group.attr({cursor: "pointer"});
            avatar.attr({fill: "#fff"});
            pattern.attr({mask: avatar});
            avatarBorder.attr({fillOpacity: 0,
                               stroke: "#888",
                               strokeWidth: (6 / scale)});

            this.group.click((e: MouseEvent) => {
                this.close();
                p.show();
            });
            this.group.hover(null, (_:MouseEvent) => this.close());

            // Ensure Person is not already larger than MAX_ZOOM.
            if (scale >= 1) {
                this.group.animate({transform: `s${scale},${scale}`}, 500, mina.backout, () => this.moveToView(scale, dimensions));
            } else {
                this.moveToView(scale, dimensions);
            }
        }

        public finalize(): void {
            this.unhighlight();

            this.state = ShowState.None;
        }

        private moveToView(scale: number, dimensions: Vector): void {
            let bbox = this.group.getBBox();
            let checkCoords = (a: number, b: number, c: number) => {
                if (a < 0) {
                    return -a;
                } else if (b > c) {
                    return -(b - c);
                } else {
                    return 0;
                }
            };
            let movement = new Vector(checkCoords(bbox.x, bbox.x2, dimensions.x),
                                      checkCoords(bbox.y, bbox.y2, dimensions.y));

            // Scaled avatar is partially off-screen, so move into view.
            if (!movement.isEmpty()) {
                this.group.animate({transform: `s${scale},${scale} t${movement.x / scale},${movement.y / scale}`}, 120);
            }
        }

        private distanceFromView(): number {
            let tOffset = this.title.offset();
            let sOffset = $("#inner_scroll").offset();
            let sBottom = sOffset.top + sOffset.height;

            if (tOffset.top > sOffset.top) {
                // On screen.
                if (tOffset.top < sBottom) {
                    return 0;
                // Below.
                } else {
                    return (tOffset.top - sBottom) + tOffset.height + 8;
                }
            // Above.
            } else {
                return tOffset.top - sOffset.top;
            }
        }

        private doScroll(jump: number, remaining = 8): void {
            if (this.state == ShowState.Waiting) {
                $("#inner_scroll")[0].scrollTop += jump;

                if (remaining > 0) {
                    requestAnimationFrame(() => this.doScroll(jump, remaining - 1));
                }
            }
        }

        private andClose(f?: () => void): boolean {
          if (typeof f === "function") { f(); }
          this.close();

          return false;
        }

        private highlight(): void {
            this.title.addClass("selected");
        }

        private unhighlight(): void {
            this.title.removeClass("selected");
        }

        private close(): void {
            this.person.unhighlight();

            if (this.group) {
                this.group.animate({transform: "s1,1"}, 200, mina.linear, () => this.group.remove());
            }
        }
    }
}
