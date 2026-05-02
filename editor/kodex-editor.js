/**
 * CodeMirror 6 editor: themes, FX layers, and a small API compatible with textarea usage.
 */
import { EditorView, basicSetup } from "https://esm.sh/codemirror@6.0.2";
import { EditorState, Compartment } from "https://esm.sh/@codemirror/state@6";
import { javascript } from "https://esm.sh/@codemirror/lang-javascript@6.2.2";
import { syntaxHighlighting, HighlightStyle } from "https://esm.sh/@codemirror/language@6";
import { tags as t } from "https://esm.sh/@lezer/highlight@1";
import { createShellFxController } from "./shell-fx.js";
import { kodexAutocomplete } from "./kodex-completions.js";

const THEME_STORAGE = "kodex-editor-theme";
const FX_STORAGE = "kodex-editor-fx";

function highlight(colors) {
  return HighlightStyle.define([
    { tag: t.keyword, color: colors.keyword },
    { tag: t.atom, color: colors.atom },
    { tag: t.bool, color: colors.bool },
    { tag: t.literal, color: colors.literal },
    { tag: t.string, color: colors.string },
    { tag: t.regexp, color: colors.regexp },
    { tag: t.escape, color: colors.escape },
    { tag: t.special(t.string), color: colors.specialString },
    { tag: t.definition(t.variableName), color: colors.variableName },
    { tag: t.local(t.variableName), color: colors.localVar },
    { tag: t.definition(t.propertyName), color: colors.propertyName },
    { tag: t.labelName, color: colors.labelName },
    { tag: t.typeName, color: colors.typeName },
    { tag: t.namespace, color: colors.namespace },
    { tag: t.className, color: colors.className },
    { tag: t.macroName, color: colors.macroName },
    { tag: t.propertyName, color: colors.property },
    { tag: t.integer, color: colors.number },
    { tag: t.float, color: colors.number },
    { tag: t.standard(t.tagName), color: colors.tag },
    { tag: t.tagName, color: colors.tag },
    { tag: t.angleBracket, color: colors.angleBracket },
    { tag: t.attributeName, color: colors.attribute },
    { tag: t.operator, color: colors.operator },
    { tag: t.comment, color: colors.comment },
    { tag: t.meta, color: colors.meta },
    { tag: t.invalid, color: colors.invalid },
    { tag: t.punctuation, color: colors.punctuation },
    { tag: t.bracket, color: colors.bracket },
    { tag: t.special(t.bracket), color: colors.bracket },
    { tag: t.variableName, color: colors.variable },
    { tag: t.function(t.variableName), color: colors.function }
  ]);
}

function editorChrome(ui) {
  return EditorView.theme(
    {
      "&": {
        height: "100%",
        fontSize: "14px",
        backgroundColor: "transparent"
      },
      ".cm-scroller": {
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        lineHeight: 1.65,
        backgroundColor: ui.scrollerBg,
        backgroundImage: ui.scrollerNoise
      },
      ".cm-content": {
        caretColor: ui.caret,
        paddingTop: "12px",
        paddingBottom: "18px"
      },
      ".cm-gutters": {
        backgroundColor: ui.gutterBg,
        color: ui.gutterFg,
        border: "none",
        borderRight: `1px solid ${ui.gutterBorder}`
      },
      ".cm-activeLineGutter": {
        backgroundColor: ui.activeLineGutter
      },
      ".cm-activeLine": {
        backgroundColor: ui.activeLine
      },
      ".cm-selectionBackground, ::selection": {
        backgroundColor: ui.selection + " !important"
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: ui.caret
      },
      ".cm-foldPlaceholder": {
        backgroundColor: ui.foldBg,
        border: "none",
        color: ui.foldFg
      }
    },
    { dark: ui.dark }
  );
}

const themeDefs = {
  kodex: {
    id: "kodex",
    label: "Kodex Night",
    ui: {
      dark: true,
      scrollerBg: "rgba(4, 12, 18, 0.42)",
      scrollerNoise:
        "linear-gradient(180deg, rgba(110, 242, 210, 0.04), transparent 28%), linear-gradient(90deg, rgba(118, 198, 255, 0.03) 1px, transparent 1px)",
      caret: "#6ef2d2",
      gutterBg: "rgba(3, 10, 16, 0.55)",
      gutterFg: "rgba(150, 174, 190, 0.75)",
      gutterBorder: "rgba(150, 219, 255, 0.12)",
      activeLineGutter: "rgba(110, 242, 210, 0.08)",
      activeLine: "rgba(118, 198, 255, 0.06)",
      selection: "rgba(110, 242, 210, 0.22)",
      foldBg: "rgba(255,255,255,0.06)",
      foldFg: "#96aebe"
    },
    colors: {
      keyword: "#6ef2d2",
      atom: "#9cecfb",
      bool: "#ffb86b",
      literal: "#ffb86b",
      string: "#8be8ff",
      regexp: "#ff9ed8",
      escape: "#c7a8ff",
      specialString: "#7cdbff",
      variableName: "#e8f7ff",
      localVar: "#dceef9",
      propertyName: "#76c6ff",
      labelName: "#6ef2d2",
      typeName: "#9bdcff",
      namespace: "#7cdbff",
      className: "#ffd28a",
      macroName: "#c7a8ff",
      property: "#9bdcff",
      number: "#ffb86b",
      tag: "#6ef2d2",
      angleBracket: "#76c6ff",
      attribute: "#9cecfb",
      operator: "#7cdbff",
      comment: "rgba(150, 174, 190, 0.85)",
      meta: "rgba(150, 174, 190, 0.65)",
      invalid: "#ff8b8b",
      punctuation: "rgba(220, 238, 249, 0.55)",
      bracket: "rgba(220, 238, 249, 0.65)",
      variable: "#dceef9",
      function: "#76c6ff"
    }
  },
  aurora: {
    id: "aurora",
    label: "Aurora Glass",
    ui: {
      dark: true,
      scrollerBg: "rgba(8, 18, 32, 0.35)",
      scrollerNoise:
        "radial-gradient(120% 80% at 10% 0%, rgba(118, 198, 255, 0.12), transparent 50%), radial-gradient(100% 60% at 90% 20%, rgba(199, 168, 255, 0.1), transparent 55%)",
      caret: "#c7a8ff",
      gutterBg: "rgba(6, 14, 26, 0.45)",
      gutterFg: "rgba(200, 220, 255, 0.55)",
      gutterBorder: "rgba(199, 168, 255, 0.15)",
      activeLineGutter: "rgba(199, 168, 255, 0.1)",
      activeLine: "rgba(118, 198, 255, 0.08)",
      selection: "rgba(199, 168, 255, 0.22)",
      foldBg: "rgba(255,255,255,0.07)",
      foldFg: "#c8dcff"
    },
    colors: {
      keyword: "#d4b8ff",
      atom: "#9cecfb",
      bool: "#ffd28a",
      literal: "#ffd28a",
      string: "#8be8ff",
      regexp: "#ff9ed8",
      escape: "#c7a8ff",
      specialString: "#a8f0ff",
      variableName: "#f2f6ff",
      localVar: "#e4ecff",
      propertyName: "#9bdcff",
      labelName: "#d4b8ff",
      typeName: "#b8d8ff",
      namespace: "#9cecfb",
      className: "#ffd28a",
      macroName: "#c7a8ff",
      property: "#9bdcff",
      number: "#ffb86b",
      tag: "#d4b8ff",
      angleBracket: "#76c6ff",
      attribute: "#9cecfb",
      operator: "#b8d8ff",
      comment: "rgba(180, 200, 230, 0.65)",
      meta: "rgba(180, 200, 230, 0.5)",
      invalid: "#ff8b8b",
      punctuation: "rgba(230, 236, 255, 0.5)",
      bracket: "rgba(230, 236, 255, 0.6)",
      variable: "#e4ecff",
      function: "#76c6ff"
    }
  },
  paper: {
    id: "paper",
    label: "Paper Terminal",
    ui: {
      dark: false,
      scrollerBg: "rgba(252, 250, 245, 0.5)",
      scrollerNoise:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0.03), rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)",
      caret: "#1a3a52",
      gutterBg: "rgba(245, 242, 235, 0.65)",
      gutterFg: "rgba(60, 72, 88, 0.55)",
      gutterBorder: "rgba(26, 58, 82, 0.12)",
      activeLineGutter: "rgba(26, 58, 82, 0.06)",
      activeLine: "rgba(26, 58, 82, 0.05)",
      selection: "rgba(26, 58, 82, 0.14)",
      foldBg: "rgba(26, 58, 82, 0.08)",
      foldFg: "#3c4858"
    },
    colors: {
      keyword: "#0d6e62",
      atom: "#0b5cad",
      bool: "#a34b00",
      literal: "#a34b00",
      string: "#0b5cad",
      regexp: "#8b1a6b",
      escape: "#5a2d8a",
      specialString: "#0b5cad",
      variableName: "#1a2a38",
      localVar: "#243444",
      propertyName: "#0b5cad",
      labelName: "#0d6e62",
      typeName: "#1a5080",
      namespace: "#0b5cad",
      className: "#a34b00",
      macroName: "#5a2d8a",
      property: "#1a5080",
      number: "#a34b00",
      tag: "#0d6e62",
      angleBracket: "#0b5cad",
      attribute: "#0d6e62",
      operator: "#1a5080",
      comment: "rgba(60, 72, 88, 0.55)",
      meta: "rgba(60, 72, 88, 0.45)",
      invalid: "#b00020",
      punctuation: "rgba(36, 52, 68, 0.55)",
      bracket: "rgba(36, 52, 68, 0.65)",
      variable: "#243444",
      function: "#0b5cad"
    }
  },
  ember: {
    id: "ember",
    label: "Ember Haze",
    ui: {
      dark: true,
      scrollerBg: "rgba(18, 8, 6, 0.4)",
      scrollerNoise:
        "radial-gradient(ellipse at 20% 0%, rgba(255, 140, 90, 0.12), transparent 45%), radial-gradient(ellipse at 80% 100%, rgba(255, 80, 120, 0.08), transparent 50%)",
      caret: "#ffb48a",
      gutterBg: "rgba(28, 10, 8, 0.55)",
      gutterFg: "rgba(255, 200, 180, 0.45)",
      gutterBorder: "rgba(255, 140, 100, 0.15)",
      activeLineGutter: "rgba(255, 120, 80, 0.12)",
      activeLine: "rgba(255, 100, 80, 0.08)",
      selection: "rgba(255, 140, 90, 0.22)",
      foldBg: "rgba(255,255,255,0.06)",
      foldFg: "#ffc8b8"
    },
    colors: {
      keyword: "#ffb48a",
      atom: "#ff9a7a",
      bool: "#ffd28a",
      literal: "#ffd28a",
      string: "#ffccaa",
      regexp: "#ff9ed8",
      escape: "#ffa8c8",
      specialString: "#ffd4c0",
      variableName: "#fff2ec",
      localVar: "#ffe8dc",
      propertyName: "#ff9a7a",
      labelName: "#ffb48a",
      typeName: "#ffc8a8",
      namespace: "#ff9a7a",
      className: "#ffd28a",
      macroName: "#ffa8c8",
      property: "#ffc8a8",
      number: "#ffd28a",
      tag: "#ffb48a",
      angleBracket: "#ff9a7a",
      attribute: "#ffccaa",
      operator: "#ffc8a8",
      comment: "rgba(255, 200, 180, 0.5)",
      meta: "rgba(255, 200, 180, 0.38)",
      invalid: "#ff6b6b",
      punctuation: "rgba(255, 230, 220, 0.5)",
      bracket: "rgba(255, 230, 220, 0.6)",
      variable: "#ffe8dc",
      function: "#ff9a7a"
    }
  }
};

export const EDITOR_THEMES = Object.values(themeDefs).map((d) => ({
  id: d.id,
  label: d.label
}));

export const EDITOR_FX = [
  { id: "none", label: "Background · Off" },
  { id: "aurora", label: "Background · Aurora drift" },
  { id: "grid", label: "Background · Neon grid" },
  { id: "particles", label: "Background · Particles" },
  { id: "pulse", label: "Background · Depth pulse" }
];

function buildThemeExtension(themeId) {
  const def = themeDefs[themeId] ?? themeDefs.kodex;
  return [editorChrome(def.ui), syntaxHighlighting(highlight(def.colors))];
}

/**
 * @param {{ shell: HTMLElement; mount: HTMLElement; onInput: () => void; initialValue?: string }} opts
 */
export function createKodexEditor({ shell, mount, onInput, initialValue = "" }) {
  const themeConf = new Compartment();
  let fxMode = localStorage.getItem(FX_STORAGE) ?? "aurora";
  if (!EDITOR_FX.some((f) => f.id === fxMode)) {
    fxMode = "aurora";
  }
  localStorage.setItem(FX_STORAGE, fxMode);
  let themeId = localStorage.getItem(THEME_STORAGE) ?? "kodex";
  if (!themeDefs[themeId]) {
    themeId = "kodex";
  }
  localStorage.setItem(THEME_STORAGE, themeId);
  const shellFx = createShellFxController(shell, fxMode);

  const state = EditorState.create({
    doc: initialValue,
    extensions: [
      basicSetup,
      javascript(),
      kodexAutocomplete,
      themeConf.of(buildThemeExtension(themeId)),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) {
          onInput();
        }
      }),
      EditorView.theme({
        "&.cm-focused": { outline: "none" },
        ".cm-editor": { height: "100%" },
        ".cm-scroller": { overflow: "auto" }
      })
    ]
  });

  const view = new EditorView({ state, parent: mount });

  function getValue() {
    return view.state.doc.toString();
  }

  function setValue(text) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: text }
    });
  }

  function setTheme(nextId) {
    themeId = themeDefs[nextId] ? nextId : "kodex";
    localStorage.setItem(THEME_STORAGE, themeId);
    view.dispatch({
      effects: themeConf.reconfigure(buildThemeExtension(themeId))
    });
  }

  function setFx(nextId) {
    const valid = EDITOR_FX.some((f) => f.id === nextId);
    fxMode = valid ? nextId : "aurora";
    localStorage.setItem(FX_STORAGE, fxMode);
    shellFx.setMode(fxMode);
  }

  function getTheme() {
    return themeId;
  }

  function getFx() {
    return fxMode;
  }

  function destroy() {
    shellFx.destroy();
    view.destroy();
  }

  return {
    view,
    get value() {
      return getValue();
    },
    set value(text) {
      setValue(text);
    },
    getValue,
    setValue,
    setTheme,
    setFx,
    getTheme,
    getFx,
    destroy
  };
}
