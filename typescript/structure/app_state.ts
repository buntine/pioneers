namespace Structure {
    export type TabState = "impact" | "timeline" | "geography";
    export type OpState = "and" | "or";

    export interface AppState {
        tab?: TabState,
        op: OpState,
        tags: Array<string>,
    }
}
