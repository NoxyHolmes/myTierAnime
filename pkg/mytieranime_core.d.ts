/* tslint:disable */
/* eslint-disable */

/**
 * 3. Экспорт расчёта метрик в JS
 */
export function calc_item_metrics_wasm(item_json: string): string;

/**
 * 1. Автоматическая замена 3 и более пробелов подряд на ", "
 */
export function normalize_triple_spaces(input: string): string;

/**
 * 4. Сортировка всех тиров по времени (от большего к меньшему, слева направо) на Rust
 */
export function sort_tiers_by_time_wasm(state_json: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly calc_item_metrics_wasm: (a: number, b: number) => [number, number];
    readonly normalize_triple_spaces: (a: number, b: number) => [number, number];
    readonly sort_tiers_by_time_wasm: (a: number, b: number) => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
