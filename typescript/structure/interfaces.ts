namespace Structure {
    export interface Win {
        person?: Person;
        name: string;
        year: number;
        reason: string;
    }

    export interface Achievement {
        year?: number;
        description: string;
        source: string;
        impact: number;
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
        total_achievements: number;
        wins?: Array<Structure.Win>;
        achievements?: Array<Structure.Achievement>;
    }

    export interface Group {
        year: number;
        achievements: Array<Structure.Achievement>;
    }
}
