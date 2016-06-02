namespace Timeline {
    export class Timeline implements Structure.Tab {

        constructor(public svg: Snap.Paper) {
        }

        public execute(state: Structure.AppState): boolean {
            this.svg.text(200, 200, "TIMELINE");

            return true;
        }

        public unfocus(): void {
            this.svg.clear();
        }

        public resize(): void {
            let [width, height] = [$(window).width(), $(window).height() - $("#impactcanvas").offset().top];

            this.svg.attr({width: width, height: height});
        }

        public built(): boolean {
          return true;
        }
    }
}
