/// <reference path='achievement.ts'/>
/// <reference path='../pioneer.ts'/>

namespace Timeline {
    export class Person extends Pioneer {
        public achievements: Array<Timeline.Achievement>;

        constructor(p: Structure.Person) {
            super();
            // TODO: This is wasteful and kind of weird as it's still got the achievements nested inside it.
            //       This should be just storing the details with Wins and Achievements.
            this.details = p;
            this.achievements = [];
        }
    }
}
