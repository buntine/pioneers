namespace Timeline {
    export class Groups {
        public people: Array<Structure.Person>;
        public years: Array<Structure.Group>;

        constructor(public svg: Snap.Paper) {
        }

        public build(people: Array<Structure.Person>): void {
            // Translate from d.people into:
            //   this.people = [{name: "Tom Jones", dob: 1920, etc} ...]
            //   this.years = [{year: 1929, achievements: [{impact: 5, description: "Something", source: "x.com", person_id: 1, ...], ...]
        }

        public draw(): void {
          this.svg.text(100, 100, "TIMELIME");
        }
    }
}
