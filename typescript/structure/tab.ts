namespace Structure {
    export interface Tab {
        execute(): void;
        build(set: Array<Structure.Person>): boolean;
        built(): boolean;
        unfocus(): void;
        resize(): void;
    }
}
