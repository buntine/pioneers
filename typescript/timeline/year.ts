namespace Timeline {
    export class Year {
        public count: number;

        constructor(public year: number) {
            this.count = 0;
        }

        public inc(): void {
            this.count++;
        }
    }
}
