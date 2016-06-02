namespace Impact {
    export class Impact implements Structure.Tab {
        public people: Impact.People;

        constructor(public svg: Snap.Paper) {
          this.people = new People();
        }

        public execute(state: Structure.AppState): boolean {
            // TODO: Move AJAX into app.ts so I don't waste calls and also so the nested returns work.
            $.getJSON("/people", state, (d: {people:Array<Structure.Person>}) => {
                let [w, h] = ["width", "height"].map(a => parseInt(this.svg.attr(a)));

                this.people.clear();

                for (let p of d.people) {
                    this.people.push(new Person(this.svg, p, Vector.randomized(w, h)));
                }

                if (this.people.length > 0) {
                    this.people.pack();
                    return true;
                } else {
                    return false;
                }
            });

            return true;
        }

        public unfocus(): void {
            this.people.clear();
            this.svg.clear();
        }

        public resize(): void {
            let [width, height] = [$(window).width(), $(window).height() - $("#impactcanvas").offset().top];

            this.people.centerize(width, height);
            this.svg.attr({width: width, height: height});
        }

        public built(): boolean {
          return this.people.length > 0;
        }
    }
}
