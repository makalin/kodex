import { attachFxCanvas, detachFxCanvas } from "./fx-canvas.js";

export const SHELL_FX_IDS = ["none", "aurora", "grid", "particles", "pulse"];

/**
 * Manages `.editor-shell--fx-*` classes and optional particle canvas on a shell element.
 */
export function createShellFxController(shell, initialMode = "aurora") {
  let mode = SHELL_FX_IDS.includes(initialMode) ? initialMode : "aurora";
  let handle = null;

  function apply() {
    SHELL_FX_IDS.forEach((id) => {
      shell.classList.remove(`editor-shell--fx-${id}`);
    });
    shell.classList.add(`editor-shell--fx-${mode}`);
    if (mode === "particles") {
      if (!handle) {
        handle = attachFxCanvas(shell);
      }
    } else if (handle) {
      detachFxCanvas(handle);
      handle = null;
    }
  }

  apply();

  return {
    setMode(next) {
      mode = SHELL_FX_IDS.includes(next) ? next : "aurora";
      apply();
    },
    getMode() {
      return mode;
    },
    destroy() {
      if (handle) {
        detachFxCanvas(handle);
        handle = null;
      }
    }
  };
}
