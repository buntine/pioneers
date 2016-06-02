/// <reference path='achievement.ts'/>

namespace Timeline {
    export class Person {
        public achievements: Array<Timeline.Achievement>;
        public details: Structure.Person;

        constructor(p: Structure.Person) {
            // TODO: This is wasteful and kind of weird as it's still got the achievements nested inside it.
            //       This should be just storing the details with Wins and Achievements.
            this.details = p;
            this.achievements = [];
        }
    }
}
