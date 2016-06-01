namespace Structure {
    export interface Win {
        name: string;
        year: number;
    }

    export interface Achievement {
        description: string;
        source: string;
        impact: number;
        year: number;
    }

    export interface Person {
        name: string;
        country: string;
        gender: string;
        impact: number;
        biography: string;
        picture: string;
        source: string;
        yob: number;
        yod: number;
        wins: Array<Structure.Win>;
        achievements: Array<Structure.Achievement>;
    }
}
