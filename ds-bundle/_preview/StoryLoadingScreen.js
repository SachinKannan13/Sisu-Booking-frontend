var __dsPreview = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // ds-raw:__ds_raw__
  var require_ds_raw = __commonJS({
    "ds-raw:__ds_raw__"(exports, module) {
      init_define_import_meta_env();
      module.exports = window.Booksphere;
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function jsx2(t, p, k) {
        return R.createElement(t, k === void 0 ? p : Object.assign({ key: k }, p));
      }
      module.exports = R;
      module.exports.jsx = jsx2;
      module.exports.jsxs = jsx2;
      module.exports.jsxDEV = jsx2;
      module.exports.Fragment = R.Fragment;
    }
  });

  // .design-sync/previews/StoryLoadingScreen.tsx
  var StoryLoadingScreen_exports = {};
  __export(StoryLoadingScreen_exports, {
    AtomicHabits: () => AtomicHabits,
    SpinnerVariants: () => SpinnerVariants
  });
  init_define_import_meta_env();

  // ds-shim:ds
  var ds_exports = {};
  __export(ds_exports, {
    default: () => ds_default
  });
  init_define_import_meta_env();
  __reExport(ds_exports, __toESM(require_ds_raw()));
  var g = window.Booksphere;
  var ds_default = "default" in g ? g.default : g;

  // .design-sync/previews/StoryLoadingScreen.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var LoadingScreenPreview = ({ bookTitle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 32px", gap: "32px", textAlign: "center", maxWidth: "448px", margin: "0 auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", backgroundSize: "200% 100%", pointerEvents: "none" } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: "80px", height: "80px", background: "rgba(245, 166, 35, 0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245, 166, 35, 0.2)" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "#f5a623", strokeWidth: "1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })
    ] }) }),
    bookTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#9a8a78", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }, children: bookTitle }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { color: "#f5f0e8", fontSize: "24px", fontWeight: 600, margin: 0 }, children: "Generating Your Story" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#f5a623", fontSize: "16px", margin: 0 }, children: "Mapping your journey through Chennai..." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: "8px" }, children: [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#f5a623", opacity: i === 1 ? 1 : 0.25 } }, i)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#5a4a3a", fontSize: "13px", margin: 0 }, children: "This takes 60–120 seconds — Chennai, and the art for each scene, are being built around you..." })
  ] });
  var AtomicHabits = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "#0d0d0d", minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingScreenPreview, { bookTitle: "Atomic Habits" }) });
  var SpinnerVariants = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#0d0d0d", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.SpinnerOverlay, { message: "Loading chapters..." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.SpinnerOverlay, { message: "Saving your progress..." })
  ] });
  return __toCommonJS(StoryLoadingScreen_exports);
})();
