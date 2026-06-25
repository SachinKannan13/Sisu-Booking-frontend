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

  // .design-sync/previews/ProfileSetup.tsx
  var ProfileSetup_exports = {};
  __export(ProfileSetup_exports, {
    ExistingProfile: () => ExistingProfile,
    NewProfile: () => NewProfile
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

  // .design-sync/previews/ProfileSetup.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var inputStyle = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "14px",
    color: "#f5f0e8",
    outline: "none",
    boxSizing: "border-box"
  };
  var labelStyle = { fontSize: "12px", color: "#9a8a78", display: "block", marginBottom: "4px" };
  var ProfilePanel = ({ profile }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "448px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { color: "#f5f0e8", fontWeight: 600, fontSize: "16px", margin: 0 }, children: "Your Business Profile" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#9a8a78", fontSize: "12px", marginTop: "4px", marginBottom: 0 }, children: "Used to personalise stories and book insights for you" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: { color: "#5a4a3a", background: "none", border: "none", cursor: "pointer", padding: "4px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: "Business / Startup Name *" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { readOnly: true, style: inputStyle, value: profile?.business_name || "", placeholder: "e.g. Acme EdTech" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: "Industry *" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: { ...inputStyle, cursor: "pointer" }, value: profile?.industry || "", onChange: () => {
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Select..." }),
            ["Technology", "EdTech", "FinTech", "SaaS", "Consulting"].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: i, children: i }, i))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: "Stage *" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: { ...inputStyle, cursor: "pointer" }, value: profile?.stage || "", onChange: () => {
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Select..." }),
            [["idea", "Idea stage"], ["mvp", "MVP / Early"], ["growth", "Growing"], ["scale", "Scaling"], ["established", "Established"]].map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: v, children: l }, v))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: "Team Size" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { readOnly: true, style: inputStyle, value: profile?.team_size || "", placeholder: "e.g. just me, 3 people, 15+" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: "Your Main Goal Right Now" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { readOnly: true, style: inputStyle, value: profile?.main_goal || "", placeholder: "e.g. Get first 100 paying customers" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: "Biggest Challenge Right Now" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { readOnly: true, style: inputStyle, value: profile?.current_challenge || "", placeholder: "e.g. Struggling to scale beyond early adopters" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: "20px", display: "flex", gap: "12px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: { flex: 1, padding: "8px", fontSize: "14px", color: "#9a8a78", background: "none", border: "1px solid #2a2a2a", borderRadius: "8px", cursor: "pointer" }, children: "Skip for now" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Button, { children: "Save Profile" }) })
    ] })
  ] });
  var NewProfile = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "#0d0d0d", padding: "32px", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePanel, {}) });
  var ExistingProfile = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "#0d0d0d", padding: "32px", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePanel, { profile: {
    business_name: "Chennai Fintech Labs",
    industry: "FinTech",
    stage: "growth",
    team_size: "12",
    main_goal: "Scale B2B payments to Tier-2 cities",
    current_challenge: "Enterprise sales cycle and regulatory compliance"
  } }) });
  return __toCommonJS(ProfileSetup_exports);
})();
