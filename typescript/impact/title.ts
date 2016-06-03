/// <reference path='../helpers.ts'/>

namespace Impact {
    enum ShowState {
        Unhighlighted = 0,
        Waiting = 1,
        Zooming = 2,
        Done = 3,
    }

    export class Title {
        // WARNING: Here be Dragons! 
        // I'm not really sure how to position SVG elements correctly when their dimensions
        // are dynamic so everything here is calculated at runtime. It looks kinda' stupid 
        // and probably is. Please tell me if you know a better way of doing this...

        public state: ShowState;
        public title: Snap.Element;

        private static WAIT = 800;
        private static HEIGHT = 60;
        private static FLAG_WIDTH = Math.ceil(Title.HEIGHT * 1.3)
        private static PADDING = 20;
        private static BOTTOM_OFFSET = 30;

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
                this.title.animate({fillOpacity: 1}, 300, mina.linear, () => {
                    this.state = ShowState.Done;
                });
            }
        }

        public draw(): void {
            let p = this.person;
            let mz = Math.max(p.radius * 2, Person.MAX_ZOOM);
            let mid = new Vector(mz / 2, mz / 2);
            let pos = new Vector(p.point.x - mid.x, p.point.y + (mid.y - Title.BOTTOM_OFFSET));
            let details = p.svg.text(pos.x, pos.y, p.details.name);
            let flagMask = p.svg.image(p.flagPath(), pos.x, pos.y, Title.FLAG_WIDTH, Title.HEIGHT);
            let flag = p.svg.rect(pos.x, pos.y, Title.FLAG_WIDTH - 1, Title.HEIGHT, 6);

            flag.attr({fill: flagMask.pattern(pos.x - 6, pos.y, Title.FLAG_WIDTH, Title.HEIGHT)});
            details.attr({fill: "#232323", fontSize: "18px", fontFamily: "sans-serif, arial"});

            let detailsBBox = details.getBBox();
            let width = Title.FLAG_WIDTH + (Title.PADDING * 2) + detailsBBox.w;
            let box = p.svg.rect(pos.x, pos.y, width, Title.HEIGHT, 6);

            // Center in remaining space.
            details.transform(`translate(${Title.FLAG_WIDTH + Title.PADDING - 2}, ${(Title.HEIGHT / 2) + (detailsBBox.h / 4)})`);

            this.title = p.svg.group(box, details, flag);
            this.title.attr({fill: "#fff", fillOpacity: 0});

            // Readjust to accommodate dynamic width because of pioneers name.
            this.title.transform(`translate(${(mz - width) / 2}, 0)`);
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

            this.draw();
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
                this.title.animate({fillOpacity: 0}, 150, mina.linear, () => {
                    this.title.remove();
                });
            }

            this.state = ShowState.Unhighlighted;
        }
    }
}
