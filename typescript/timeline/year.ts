namespace Timeline {
    export class Year {
        public count: number;

        constructor(public year: number) {
            this.count = 0;
        }

        public increment(): void {
            this.count++;
        }

        public draw(columnWidth: number, offset: number, svg: Snap.Paper): void {
        }
    }
}
