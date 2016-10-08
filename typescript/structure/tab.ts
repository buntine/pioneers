namespace Structure {
    export interface Tab {
        preload(callback: () => void, iteration?: number): void;
        execute(overlay: boolean): void;
        build(set: Array<Structure.Person>): boolean;
        built(): boolean;
        unfocus(): void;
        resize(w: number, h: number): void;
        setResolution(r: Structure.Resolution): void;
    }
}
