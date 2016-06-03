namespace Timeline {
    export class Year {
        public count: number;

        constructor(public year: number) {
            this.count = 0;
        }

        public increment(): void {
            this.count++;
        }

        public draw(offset: number, svg: Snap.Paper): void {
            console.log(`${offset}, ${this.year}`);
        }

    }
}
