namespace Structure {
    export interface Tab {
        preload(callback: () => void, iteration?: number): void;
        execute(): void;
        build(set: Array<Structure.Person>): boolean;
        built(): boolean;
        unfocus(): void;
        resize(): void;
        setResolution(r: Structure.Resolution): void;
    }
}
