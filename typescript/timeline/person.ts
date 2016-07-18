/// <reference path='achievement.ts'/>
/// <reference path='../pioneer.ts'/>

namespace Timeline {
    export class Person extends Pioneer {
        public achievements: Array<Timeline.Achievement>;

        constructor(p: Structure.Person) {
            super();
            // NOTE: This is wasteful and kind of weird as 'p' has still got the achievements nested inside it.
            //       This should probably be just storing the details with Achievements separately.
            this.details = p;
            this.achievements = [];
        }
    }
}
