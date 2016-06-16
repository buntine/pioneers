/// <reference path='../helpers.ts'/>

namespace Impact {
    enum ShowState {
        None = 0,
        Waiting = 1,
        Zooming = 2,
    }

    export class Title {
        public state: ShowState;
        public point: Vector;
        public group: Snap.Element;
        public title: any; // Zepto element.

        private static WAIT = 600;

        constructor(public person: Person, private offset: number) {
            this.state = ShowState.None;
            this.point = new Vector(30, 30 + (offset * 25));
        }

        public waiting(): boolean {
            return this.state < ShowState.Zooming;
        }

        public shown(): boolean {
            return this.state >= ShowState.Zooming;
        }

        public initiate(): void {
            this.state = ShowState.Waiting;

            setTimeout(() => this.zoom(), Title.WAIT);
        }

        public draw(): void {
            let p = this.person;

            this.title = $(`<li><a href="#">${p.details.name}</a></li>`);
            this.title.find("a")
                      .on("mouseenter", (_:MouseEvent) => this.person.highlight())
                      .on("mouseleave", (_:MouseEvent) => this.andClose(() => this.person.unhighlight()))
                      .on("click", (_:MouseEvent) => this.andClose(() => this.person.show()));

            $("#peopleList ul").append(this.title);
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

            this.group = p.svg.group(pattern, avatarBorder);
            this.state = ShowState.Zooming;

            this.group.attr({cursor: "pointer"});
            avatar.attr({fill: "#fff"});
            pattern.attr({mask: avatar});
            avatarBorder.attr({fillOpacity: 0,
                               stroke: "#888",
                               strokeWidth: (6 / scale)});

            this.highlight()

            this.group.click((e: MouseEvent) => {
                this.close();
                p.show();
            });
            this.group.hover(null, (_:MouseEvent) => this.close());

            // Person is larger than MAX_ZOOM so skip zoom in.
            if (scale >= 1) {
                this.group.animate({transform: `s${scale},${scale}`}, 500, mina.backout);
            }
        }

        public finalize(): void {
            if (this.shown()) {
                this.unhighlight();
            }

            this.state = ShowState.None;
        }

        private andClose(f: () => void): boolean {
          f();
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
