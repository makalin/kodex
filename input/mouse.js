export function attachMouse(runtime, element) {
  const handler = (event) => {
    const bounds = element.getBoundingClientRect();
    const point = {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height
    };
    runtime.setPointer(point);
    runtime.emit("mouse", point);
    runtime.emit("pointer", point);
  };

  element.addEventListener("pointermove", handler);
  element.addEventListener("click", handler);
}

