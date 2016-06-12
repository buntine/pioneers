namespace Structure {
    export interface Tab {
        preload(callback: () => void): void;
        execute(): void;
        build(set: Array<Structure.Person>): boolean;
        built(): boolean;
        unfocus(): void;
        resize(): void;
    }
}
