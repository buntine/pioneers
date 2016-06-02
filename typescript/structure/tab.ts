namespace Structure {
    export interface Tab {
        execute(state: Structure.AppState): boolean;
        built(): boolean;
        focus(): void;
        unfocus(): void;
        resize(): void;
    }
}
