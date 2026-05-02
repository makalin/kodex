/**
 * Lightweight drifting particles behind the editor (WebGL-free).
 */

export function attachFxCanvas(shell) {
  const canvas = document.createElement("canvas");
  canvas.className = "editor-fx-canvas";
  canvas.setAttribute("aria-hidden", "true");
  shell.insertBefore(canvas, shell.firstChild);

  const ctx = canvas.getContext("2d");
  const particles = [];
  let raf = 0;
  let w = 0;
  let h = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = shell.clientWidth;
    h = shell.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.min(90, Math.floor((w * h) / 9000));
    while (particles.length < target) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.28,
        r: 0.6 + Math.random() * 1.8,
        a: 0.08 + Math.random() * 0.18,
        hue: 160 + Math.random() * 120
      });
    }
    while (particles.length > target) {
      particles.pop();
    }
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(shell);
  resize();

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      if (p.y < -4) p.y = h + 4;
      if (p.y > h + 4) p.y = -4;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 85%, 72%, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.remove();
    }
  };
}

export function detachFxCanvas(handle) {
  if (handle && typeof handle.destroy === "function") {
    handle.destroy();
  }
}
