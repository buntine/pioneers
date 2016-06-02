namespace Structure {
    export interface Tab {
        execute(state: Structure.AppState): boolean;
        built(): boolean;
        unfocus(): void;
        resize(): void;
    }
}
