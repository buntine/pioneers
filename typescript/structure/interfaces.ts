namespace Structure {
    export interface Achievement {
        year?: number;
        award?: string;
        description: string;
        source: string;
        impact: number;
    }

    export interface Person {
        id: number;
        name: string;
        country: string;
        gender: string;
        impact: number;
        biography: string;
        picture: string;
        birthplace: string;
        source: string;
        yob: number;
        yod: number;
        total_achievements: number;
        achievements?: Array<Structure.Achievement>;
    }

    export interface Group {
        year: number;
        achievements: Array<Structure.Achievement>;
    }
}
