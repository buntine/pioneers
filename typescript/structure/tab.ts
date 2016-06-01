namespace Structure {
    export interface Tab {
        execute(state: Structure.AppState): boolean;
        focus(): void;
        unfocus(): void;
        resize(): void;
    }
}
