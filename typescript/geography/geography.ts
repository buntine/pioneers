namespace Geography {
    export class Geography implements Structure.Tab {
        constructor(public svg: Snap.Paper) {
        }

        public build(set: Array<Structure.Person>) : boolean {
            return true;
        }

        public preload(callback: () => void, iteration = 1): void {
            callback();
        }

        public execute(): void {
            $("#comingsoon").show();
        }

        public unfocus(): void {
            $("#comingsoon").hide();
        }

        public resize(w: number, h: number): void {
        }

        public built(): boolean {
            return true;
        }

        public setResolution(r: Structure.Resolution): void {
        }
    }
}
