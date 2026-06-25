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

  // .design-sync/previews/MessageBubble.tsx
  var MessageBubble_exports = {};
  __export(MessageBubble_exports, {
    AssistantWithInsight: () => AssistantWithInsight,
    Conversation: () => Conversation,
    UserMessage: () => UserMessage
  });
  init_define_import_meta_env();
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var GENRE_COLOR = {
    "self-help": "#f5a623",
    "thriller": "#c0392b",
    "romance": "#e91e8c",
    "educational": "#2d9b6f",
    "fiction": "#4a90d9",
    "horror": "#7b2d2d"
  };
  var MsgBubble = ({ role, content, insight, followups, genre, time }) => {
    const isUser = role === "user";
    const color = GENRE_COLOR[genre] || "#f5a623";
    const timestamp = time || "09:41";
    const paragraphs = (content || "").split(/\n\n+/).filter(Boolean);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "16px", flexDirection: isUser ? "row-reverse" : "row" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px", backgroundColor: isUser ? "#f5a62315" : `${color}18`, border: `1px solid ${isUser ? "#f5a62330" : `${color}35`}` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: isUser ? "#f5a623" : color, strokeWidth: "2", children: isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })
      ] }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { maxWidth: "85%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px", padding: "12px 16px", fontSize: "14px", lineHeight: 1.6, border: `1px solid ${isUser ? "#f5a62333" : "#2a2a2a"}`, borderLeft: !isUser ? `2px solid ${color}80` : void 0, background: isUser ? "#f5a62326" : "#1a1a1a", color: isUser ? "#f5f0e8" : "#e8ddd0", display: "flex", flexDirection: "column", gap: "8px" }, children: paragraphs.map((p, i) => {
          const parts = p.split(/\*\*(.+?)\*\*/g);
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { margin: 0, whiteSpace: "pre-wrap" }, children: parts.map((part, j) => j % 2 === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: "#f5f0e8", fontWeight: 600 }, children: part }, j) : part) }, i);
        }) }),
        insight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: "8px", display: "flex", alignItems: "flex-start", gap: "8px", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: "12px", padding: "10px 12px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#f5a623", strokeWidth: "2", style: { flexShrink: 0, marginTop: "2px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { margin: 0, fontSize: "12px", color: "rgba(245,166,35,0.9)", lineHeight: 1.5 }, children: insight })
        ] }),
        followups?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }, children: followups.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: { fontSize: "12px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#9a8a78", padding: "6px 12px", borderRadius: "999px", cursor: "pointer" }, children: q }, i)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: "10px", color: "#5a4a3a", margin: "4px 0 0", textAlign: isUser ? "right" : "left" }, children: timestamp })
      ] })
    ] });
  };
  var UserMessage = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "#0d0d0d", padding: "16px", maxWidth: "620px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MsgBubble, { role: "user", content: "How can I apply the concept of habit stacking to my startup routine?", genre: "self-help", time: "09:41" }) });
  var AssistantWithInsight = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "#0d0d0d", padding: "16px", maxWidth: "620px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    MsgBubble,
    {
      role: "assistant",
      genre: "self-help",
      time: "09:42",
      content: `Habit stacking is particularly powerful for founders. **The formula**: "After I [CURRENT HABIT], I will [NEW HABIT]."

For your startup routine, consider anchoring high-leverage activities to existing habits — your morning coffee becomes your weekly metrics review, your team standup ends with a 5-minute strategic question.`,
      insight: "Founders who systemise decision-making through habits free up cognitive bandwidth for creative problem-solving.",
      followups: ["What habits should I prioritise first?", "How long until a habit becomes automatic?"]
    }
  ) });
  var Conversation = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#0d0d0d", padding: "16px", maxWidth: "620px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MsgBubble, { role: "user", content: "How can I apply the concept of habit stacking to my startup routine?", genre: "self-help", time: "09:41" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      MsgBubble,
      {
        role: "assistant",
        genre: "self-help",
        time: "09:42",
        content: `Habit stacking is particularly powerful for founders. **The formula**: "After I [CURRENT HABIT], I will [NEW HABIT]."

For your startup routine, consider anchoring high-leverage activities to existing habits — your morning coffee becomes your weekly metrics review.`,
        insight: "Founders who systemise decision-making through habits free up cognitive bandwidth for creative problem-solving.",
        followups: ["What habits should I prioritise first?", "How long until a habit becomes automatic?"]
      }
    )
  ] });
  return __toCommonJS(MessageBubble_exports);
})();
