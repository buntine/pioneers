/// <reference path='../helpers.ts'/>

namespace Impact {
    enum ShowState {
        Unhighlighted = 0,
        Waiting = 1,
        Zooming = 2,
        Done = 3,
    }

    export class Title {
        public state: ShowState;

        private static WAIT = 600;

        constructor(public person: Person) {
            this.state = ShowState.Unhighlighted;
        }

        public unhighlighted(): boolean {
            return this.state < ShowState.Zooming;
        }

        public shown(): boolean {
            return this.state >= ShowState.Zooming;
        }

        public initiate(): void {
            this.state = ShowState.Waiting;

            setTimeout(() => this.zoom(), Title.WAIT);
        }

        public show(): void {
            if (this.state == ShowState.Zooming) {
                // drawline()
                this.state = ShowState.Done;
            }
        }

        public zoom(): void {
            if (this.state != ShowState.Waiting) { return; }

            let p = this.person;
            let mass = p.radius * 2;
            let scale = Person.MAX_ZOOM / mass;
            let pt = p.point;
            let tl = p.topLeft();

            // In order to get zoom appearing correctly I need to draw new image over the existing one and
            // scale it. It's a hack, but without this I get weird behaviour depending on the original draw
            // order of the people. The pattern also does not scale on the original person circle.
            let pattern = p.svg.image(Helpers.imageSource("people", p.details.picture), tl.x, tl.y, mass, mass);
            let avatarBorder = p.svg.circle(pt.x, pt.y, p.radius);
            let avatar = avatarBorder.clone();
            let g = p.svg.group(pattern, avatarBorder);
            let close = () => {
                p.unhighlight();
                g.animate({transform: "s1,1"}, 200, mina.linear, () => g.remove());
            };

            this.state = ShowState.Zooming;

            g.attr({cursor: "pointer"});
            avatar.attr({fill: "#fff"});
            pattern.attr({mask: avatar});
            avatarBorder.attr({fillOpacity: 0,
                               stroke: "#888",
                               strokeWidth: (6 / scale)});

            g.click((e: MouseEvent) => {
                close();
                p.show();
            });
            g.hover(null, close);

            // Person is larger than MAX_ZOOM so skip zoom in.
            if (scale < 1) {
                this.show()
            } else {
                g.animate({transform: `s${scale},${scale}`}, 500, mina.backout, () => this.show());
            }
        }

        public finalize(): void {
            if (this.shown()) {
                // removeLine()
            }

            this.state = ShowState.Unhighlighted;
        }
    }
}
