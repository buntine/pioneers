namespace Structure {
    export interface Tab {
        execute(): boolean;
        build(set: Array<Structure.Person>): boolean;
        built(): boolean;
        unfocus(): void;
        resize(): void;
    }
}
