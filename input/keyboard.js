export function attachKeyboard(runtime) {
  window.addEventListener("keydown", (event) => {
    runtime.emit(`key:${event.key.toLowerCase()}`, { key: event.key.toLowerCase() });
    if (event.code === "Space") {
      runtime.emit("space", { key: "space" });
    }
  });
}

