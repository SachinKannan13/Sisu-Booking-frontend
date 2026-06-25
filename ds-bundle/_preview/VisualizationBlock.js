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

  // .design-sync/previews/VisualizationBlock.tsx
  var VisualizationBlock_exports = {};
  __export(VisualizationBlock_exports, {
    HabitLoop: () => HabitLoop,
    Timeline: () => Timeline
  });
  init_define_import_meta_env();
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var VizPanel = ({ type, title, code }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: "12px", borderRadius: "12px", overflow: "hidden", border: "1px solid #2a2a2a", background: "#0d0d0d" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #1a1a1a" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#f5a623", strokeWidth: "2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "18", y1: "20", x2: "18", y2: "10" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "12", y1: "20", x2: "12", y2: "4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "6", y1: "20", x2: "6", y2: "14" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "#9a8a78", fontWeight: 500 }, children: title || type })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: { color: "#5a4a3a", background: "none", border: "none", cursor: "pointer", padding: "4px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "7 10 12 15 17 10" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "24px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }, dangerouslySetInnerHTML: { __html: code } })
  ] });
  var habitLoopSvg = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#f5a623"/>
    </marker>
  </defs>
  <circle cx="200" cy="150" r="80" fill="none" stroke="#2a2a2a" stroke-width="2"/>
  <circle cx="200" cy="70" r="36" fill="#1a1a1a" stroke="#f5a623" stroke-width="1.5"/>
  <text x="200" y="65" text-anchor="middle" fill="#f5f0e8" font-size="11">Cue</text>
  <text x="200" y="80" text-anchor="middle" fill="#9a8a78" font-size="9">Morning alarm</text>
  <circle cx="310" cy="200" r="36" fill="#1a1a1a" stroke="#7b5ea7" stroke-width="1.5"/>
  <text x="310" y="195" text-anchor="middle" fill="#f5f0e8" font-size="11">Routine</text>
  <text x="310" y="210" text-anchor="middle" fill="#9a8a78" font-size="9">Exercise</text>
  <circle cx="90" cy="200" r="36" fill="#1a1a1a" stroke="#2d9b6f" stroke-width="1.5"/>
  <text x="90" y="195" text-anchor="middle" fill="#f5f0e8" font-size="11">Reward</text>
  <text x="90" y="210" text-anchor="middle" fill="#9a8a78" font-size="9">Coffee</text>
  <line x1="225" y1="100" x2="285" y2="165" stroke="#f5a623" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="275" y1="220" x2="130" y2="220" stroke="#7b5ea7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="110" y1="175" x2="180" y2="100" stroke="#2d9b6f" stroke-width="1.5" marker-end="url(#arrow)"/>
</svg>`;
  var timelineSvg = `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="60" x2="460" y2="60" stroke="#2a2a2a" stroke-width="2"/>
  ${[["Day 1", 40, "Start tiny"], ["Week 1", 140, "Build cue"], ["Week 4", 260, "Automate"], ["3 Months", 380, "Identity shift"]].map(([label, x, sub]) => `
    <circle cx="${x}" cy="60" r="8" fill="#f5a623"/>
    <text x="${x}" y="40" text-anchor="middle" fill="#f5f0e8" font-size="11">${label}</text>
    <text x="${x}" y="90" text-anchor="middle" fill="#9a8a78" font-size="10">${sub}</text>
  `).join("")}
</svg>`;
  var HabitLoop = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "#0d0d0d", padding: "16px", maxWidth: "520px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VizPanel, { type: "diagram", title: "The Habit Loop", code: habitLoopSvg }) });
  var Timeline = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "#0d0d0d", padding: "16px", maxWidth: "520px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VizPanel, { type: "timeline", title: "Habit Formation Timeline", code: timelineSvg }) });
  return __toCommonJS(VisualizationBlock_exports);
})();
