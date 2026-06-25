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

  // .design-sync/previews/Modal.tsx
  var Modal_exports = {};
  __export(Modal_exports, {
    DeleteConfirmation: () => DeleteConfirmation,
    GenreSelection: () => GenreSelection,
    UploadBook: () => UploadBook
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

  // .design-sync/previews/Modal.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var ModalPanel = ({ title, children, size = "md" }) => {
    const maxWidths = { sm: "448px", md: "512px", lg: "672px", xl: "896px" };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#0d0d0d", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "rgba(0,0,0,0.7)", position: "absolute", inset: 0 } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        position: "relative",
        width: "100%",
        maxWidth: maxWidths[size],
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #2a2a2a" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { color: "#f5f0e8", fontSize: "18px", fontWeight: 600, margin: 0 }, children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#9a8a78", cursor: "pointer", fontSize: "18px", lineHeight: 1 }, children: "✕" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "24px" }, children })
      ] })
    ] });
  };
  var DeleteConfirmation = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalPanel, { title: "Confirm Delete", size: "sm", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#9a8a78", marginBottom: "20px", fontSize: "14px", lineHeight: 1.6 }, children: "Are you sure you want to remove this book from your library? This action cannot be undone." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Button, { variant: "secondary", size: "sm", children: "Cancel" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Button, { variant: "danger", size: "sm", children: "Delete Book" })
    ] })
  ] });
  var UploadBook = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalPanel, { title: "Upload a Book", size: "md", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#9a8a78", fontSize: "14px", lineHeight: 1.6, margin: 0 }, children: "Upload a PDF or EPUB file to generate your personalised story experience in Chennai." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { border: "2px dashed #333", borderRadius: "12px", padding: "32px", textAlign: "center", color: "#5a4a3a", fontSize: "14px" }, children: "Drop file here or click to browse" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Button, { variant: "secondary", size: "md", children: "Cancel" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Button, { variant: "primary", size: "md", children: "Upload" })
    ] })
  ] }) });
  var GenreSelection = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalPanel, { title: "Select a Genre", size: "md", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#9a8a78", fontSize: "14px", margin: 0, lineHeight: 1.6 }, children: "Choose the genre that best matches your book to personalise the storytelling experience." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" }, children: ["Thriller", "Romance", "Self-Help", "Fantasy", "Historical", "Educational"].map((g2) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { padding: "8px 16px", background: "#242424", border: "1px solid #333", borderRadius: "8px", color: "#f5f0e8", fontSize: "13px", cursor: "pointer" }, children: g2 }, g2)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Button, { variant: "secondary", size: "md", children: "Cancel" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Button, { variant: "primary", size: "md", children: "Confirm" })
    ] })
  ] }) });
  return __toCommonJS(Modal_exports);
})();
