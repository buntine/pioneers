namespace Timeline {
    export class Achievement implements Structure.Achievement {
        constructor(public description: string, public source: string, public impact: number, private row: number, private column: number) {
        }

        public draw(svg: Snap.Paper): void {
        }
    }
}
 
