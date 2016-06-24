namespace Structure {
    export type TabState = "impact" | "timeline" | "geography";
    export type OpState = "AND" | "OR";

    export interface AppState {
        tab?: TabState,
        op: OpState,
        tags: Array<string>,
    }
}
