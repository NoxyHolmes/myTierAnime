/* ═══════════════════ RUST WEBASSEMBLY BRIDGE (js/wasm-bridge.js) ═══════════════════ */
(async function initRustWasmEngine() {
  try {
    const wasmModule = await import("../pkg/mytieranime_core.js");
    await wasmModule.default("../pkg/mytieranime_core_bg.wasm");

    window.RustEngine = {
      ready: true,
      normalizeTripleSpaces: wasmModule.normalize_triple_spaces,
      calcItemMetricsWasm: wasmModule.calc_item_metrics_wasm,
      sortTiersByTimeWasm: wasmModule.sort_tiers_by_time_wasm
    };

    console.log("🦀 Движок Rust WebAssembly (mytieranime-core) успешно активирован!");
  } catch (err) {
    window.RustEngine = { ready: false };
    console.info("ℹ️ Rust Wasm ещё не скомпилирован в /pkg, используется штатный JS-движок.");
  }
})();
