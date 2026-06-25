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

  // .design-sync/previews/BookCard.tsx
  var BookCard_exports = {};
  __export(BookCard_exports, {
    GenreVariants: () => GenreVariants,
    Processing: () => Processing,
    ReadyState: () => ReadyState
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

  // .design-sync/previews/BookCard.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var GENRE_COLORS = {
    "self-help": "#f5a623",
    "educational": "#2d9b6f",
    "thriller": "#c0392b",
    "romance": "#e91e8c",
    "horror": "#7b2d2d",
    "fiction": "#4a90d9",
    "biography": "#7b5ea7",
    "business": "#2980b9",
    "science": "#16a085",
    "history": "#8e6b3e"
  };
  var BookCardPanel = ({ book }) => {
    const coverColor = book.cover_color || GENRE_COLORS[book.genre] || "#1a3a5c";
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", borderRadius: "12px", overflow: "hidden", border: "1px solid #2a2a2a", background: "#1a1a1a", boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { height: "176px", display: "flex", alignItems: "flex-end", padding: "16px", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${coverColor}cc 0%, ${coverColor}55 100%)` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "absolute", top: "16px", right: "16px", width: "96px", height: "96px", borderRadius: "50%", backgroundColor: coverColor, opacity: 0.2 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "absolute", top: "-16px", left: "-16px", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: coverColor, opacity: 0.1 } }),
        book.status !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "absolute", inset: 0, background: "rgba(13,13,13,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: "32px", height: "32px", borderRadius: "50%", border: "2px solid rgba(245,166,35,0.3)", borderTopColor: "#f5a623" } }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GenreBadge, { genre: book.genre })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontWeight: 600, color: "#f5f0e8", fontSize: "14px", lineHeight: 1.4, margin: 0 }, children: book.title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#9a8a78", fontSize: "12px", margin: 0 }, children: book.author || "Unknown Author" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: "auto", paddingTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.ProcessingStatus, { status: book.status }),
          book.status === "ready" && book.word_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#5a4a3a", fontSize: "12px" }, children: [
            Math.round(book.word_count / 250),
            " pages"
          ] })
        ] })
      ] })
    ] });
  };
  var ReadyState = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "24px", background: "#0d0d0d", maxWidth: "520px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCardPanel, { book: { id: "1", title: "Atomic Habits", author: "James Clear", genre: "self-help", status: "ready", word_count: 7e4 } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCardPanel, { book: { id: "3", title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "thriller", status: "ready", word_count: 18e4 } })
  ] });
  var Processing = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "24px", background: "#0d0d0d", maxWidth: "260px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCardPanel, { book: { id: "2", title: "Zero to One", author: "Peter Thiel", genre: "educational", status: "processing" } }) });
  var GenreVariants = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "24px", background: "#0d0d0d", maxWidth: "520px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCardPanel, { book: { id: "4", title: "Pride and Prejudice", author: "Jane Austen", genre: "romance", status: "ready", word_count: 12e4 } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCardPanel, { book: { id: "5", title: "The Shining", author: "Stephen King", genre: "horror", status: "ready", word_count: 15e4 } })
  ] });
  return __toCommonJS(BookCard_exports);
})();
