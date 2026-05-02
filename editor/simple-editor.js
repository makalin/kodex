import { createShellFxController, SHELL_FX_IDS } from "./shell-fx.js";

const FX_STORAGE = "kodex-editor-fx";

/**
 * Plain textarea with the same value / FX shell behaviour as the CodeMirror path.
 */
export function createSimpleEditor({ shell, onInput, initialValue = "" }) {
  let fxMode = localStorage.getItem(FX_STORAGE) ?? "aurora";
  if (!SHELL_FX_IDS.includes(fxMode)) {
    fxMode = "aurora";
  }
  localStorage.setItem(FX_STORAGE, fxMode);
  const shellFx = createShellFxController(shell, fxMode);

  const ta = document.createElement("textarea");
  ta.className = "editor-simple-textarea";
  ta.spellcheck = false;
  ta.value = initialValue;
  shell.appendChild(ta);

  function emit() {
    onInput();
  }

  ta.addEventListener("input", emit);

  function getValue() {
    return ta.value;
  }

  function setValue(text) {
    ta.value = text;
  }

  function setFx(nextId) {
    fxMode = SHELL_FX_IDS.includes(nextId) ? nextId : "aurora";
    localStorage.setItem(FX_STORAGE, fxMode);
    shellFx.setMode(fxMode);
  }

  function getFx() {
    return fxMode;
  }

  function destroy() {
    shellFx.destroy();
    ta.remove();
  }

  return {
    get value() {
      return getValue();
    },
    set value(text) {
      setValue(text);
    },
    getValue,
    setValue,
    setTheme() {},
    getTheme() {
      return "simple";
    },
    setFx,
    getFx,
    destroy,
    focus() {
      ta.focus();
    }
  };
}
