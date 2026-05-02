import { createRuntime } from "./core/runtime.js";
import {
  EXAMPLES,
  DEFAULT_EXAMPLE_ID,
  populateExampleSelect
} from "./examples/index.js";
import { createKodexEditor, EDITOR_THEMES, EDITOR_FX } from "./editor/kodex-editor.js";
import { createSimpleEditor } from "./editor/simple-editor.js";

const APP_THEME_KEY = "kodex-app-theme";
const EDITOR_MODE_KEY = "kodex-editor-mode";

const editorShell = document.getElementById("editorShell");
const editorPanel = document.querySelector(".editor-panel");
const editorThemeSelect = document.getElementById("editorThemeSelect");
const editorFxSelect = document.getElementById("editorFxSelect");
const exampleSelect = document.getElementById("exampleSelect");
const loadExampleButton = document.getElementById("loadExample");
const runButton = document.getElementById("runButton");
const panicButton = document.getElementById("panicButton");
const audioButton = document.getElementById("audioButton");
const autorunToggle = document.getElementById("autorunToggle");
const statusText = document.getElementById("statusText");
const tempoValue = document.getElementById("tempoValue");
const eventValue = document.getElementById("eventValue");
const audioStateValue = document.getElementById("audioStateValue");
const scriptName = document.getElementById("scriptName");
const toolsetValue = document.getElementById("toolsetValue");

const settingsDialog = document.getElementById("settingsDialog");
const settingsOpen = document.getElementById("settingsOpen");
const settingsClose = document.getElementById("settingsClose");
const appThemeSelect = document.getElementById("appThemeSelect");
const editorModeSelect = document.getElementById("editorModeSelect");

const runtime = createRuntime({
  canvas: document.getElementById("stage"),
  onTempoChange: (tempo) => {
    tempoValue.textContent = `${tempo} BPM`;
  },
  onEvent: (name) => {
    eventValue.textContent = name;
  }
});

function updateAudioState() {
  audioStateValue.textContent = runtime.context.state;
}

function setStatus(message, tone = "neutral") {
  statusText.textContent = message;
  statusText.style.color = tone === "error"
    ? "var(--danger)"
    : tone === "ok"
      ? "var(--accent)"
      : "var(--muted)";
}

function getAppTheme() {
  const v = localStorage.getItem(APP_THEME_KEY) ?? "dark";
  return v === "light" || v === "ocean" ? v : "dark";
}

function applyAppTheme(theme) {
  const t = theme === "light" || theme === "ocean" ? theme : "dark";
  localStorage.setItem(APP_THEME_KEY, t);
  document.documentElement.setAttribute("data-app-theme", t);
  appThemeSelect.value = t;
}

function getEditorMode() {
  return localStorage.getItem(EDITOR_MODE_KEY) === "simple" ? "simple" : "pro";
}

function setEditorMode(mode) {
  const m = mode === "simple" ? "simple" : "pro";
  localStorage.setItem(EDITOR_MODE_KEY, m);
  editorModeSelect.value = m;
}

let autorunTimer = 0;
/** @type {ReturnType<createKodexEditor> | ReturnType<createSimpleEditor> | null} */
let editor = null;

function handleScriptInput() {
  scriptName.textContent = "Custom Script";
  if (!autorunToggle.checked) {
    return;
  }
  window.clearTimeout(autorunTimer);
  autorunTimer = window.setTimeout(() => {
    runCurrentScript();
  }, 260);
}

function disposeEditor() {
  if (editor) {
    editor.destroy();
    editor = null;
  }
}

function updateEditorChrome(mode) {
  editorPanel.classList.toggle("editor-panel--simple", mode === "simple");
  editorThemeSelect.disabled = mode === "simple";
  editorThemeSelect.title = mode === "simple"
    ? "Switch to Pro editor in Settings to choose CodeMirror themes."
    : "";
}

function mountEditor(mode) {
  const previous = editor ? editor.getValue() : "";
  disposeEditor();
  editorShell.replaceChildren();
  if (mode === "simple") {
    editor = createSimpleEditor({
      shell: editorShell,
      onInput: handleScriptInput,
      initialValue: previous
    });
  } else {
    const mount = document.createElement("div");
    mount.id = "codeEditorMount";
    mount.className = "editor-mount";
    editorShell.appendChild(mount);
    editor = createKodexEditor({
      shell: editorShell,
      mount,
      onInput: handleScriptInput,
      initialValue: previous
    });
    editorThemeSelect.value = editor.getTheme();
  }
  editorFxSelect.value = editor.getFx();
  updateEditorChrome(mode);
}

function populateEditorControls() {
  editorThemeSelect.replaceChildren();
  editorFxSelect.replaceChildren();
  EDITOR_THEMES.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = entry.label;
    editorThemeSelect.append(option);
  });
  EDITOR_FX.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = entry.label;
    editorFxSelect.append(option);
  });
}

function loadExample(id) {
  const example = EXAMPLES.find((entry) => entry.id === id) ?? EXAMPLES[0];
  editor.value = example.code.trim();
  scriptName.textContent = example.name;
  setStatus(`Loaded ${example.name}`);
  if (autorunToggle.checked) {
    runCurrentScript();
  }
}

async function runCurrentScript() {
  try {
    await runtime.unlockAudio();
    runtime.run(editor.getValue());
    toolsetValue.textContent = "drums / pads / fx / events";
    updateAudioState();
    setStatus("Script running", "ok");
  } catch (error) {
    console.error(error);
    setStatus(error.message, "error");
  }
}

function syncSettingsForm() {
  appThemeSelect.value = getAppTheme();
  editorModeSelect.value = getEditorMode();
}

populateExampleSelect(exampleSelect);
populateEditorControls();
applyAppTheme(getAppTheme());
setEditorMode(getEditorMode());
mountEditor(getEditorMode());

exampleSelect.value = DEFAULT_EXAMPLE_ID;
loadExample(DEFAULT_EXAMPLE_ID);

editorThemeSelect.addEventListener("change", () => {
  if (getEditorMode() !== "pro") {
    return;
  }
  editor.setTheme(editorThemeSelect.value);
  editorThemeSelect.value = editor.getTheme();
});

editorFxSelect.addEventListener("change", () => {
  editor.setFx(editorFxSelect.value);
  editorFxSelect.value = editor.getFx();
});

loadExampleButton.addEventListener("click", () => {
  loadExample(exampleSelect.value);
});

runButton.addEventListener("click", () => {
  runCurrentScript();
});

panicButton.addEventListener("click", () => {
  runtime.stopAll();
  setStatus("All voices and loops stopped");
});

audioButton.addEventListener("click", async () => {
  await runtime.unlockAudio();
  updateAudioState();
  setStatus("Audio context ready", "ok");
});

settingsOpen.addEventListener("click", () => {
  syncSettingsForm();
  settingsDialog.showModal();
  settingsOpen.setAttribute("aria-expanded", "true");
});

settingsDialog.addEventListener("close", () => {
  settingsOpen.setAttribute("aria-expanded", "false");
});

settingsClose.addEventListener("click", () => {
  settingsDialog.close();
});

appThemeSelect.addEventListener("change", () => {
  applyAppTheme(appThemeSelect.value);
});

editorModeSelect.addEventListener("change", () => {
  const mode = editorModeSelect.value === "simple" ? "simple" : "pro";
  setEditorMode(mode);
  mountEditor(mode);
});

window.addEventListener("beforeunload", () => {
  disposeEditor();
  runtime.dispose();
});

runtime.context.addEventListener("statechange", updateAudioState);
updateAudioState();
