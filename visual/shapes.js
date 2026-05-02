export function drawRings(ctx, width, height, state) {
  const centerX = width / 2;
  const centerY = height / 2;
  const ringCount = 5;
  const baseRadius = Math.min(width, height) * 0.12;

  for (let i = 0; i < ringCount; i += 1) {
    const radius = baseRadius + i * 28 + state.pulse * (10 + i * 4);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${state.hue + i * 16}, 95%, 72%, ${0.5 - i * 0.07})`;
    ctx.lineWidth = 2 + i * 0.6;
    ctx.stroke();
  }
}

export function drawBars(ctx, width, height, state) {
  const barCount = 18;
  const gutter = width / barCount;

  for (let i = 0; i < barCount; i += 1) {
    const energy = 0.18 + Math.sin(state.time * 0.002 + i * 0.6) * 0.1 + state.energy * 0.6;
    const barHeight = height * Math.max(0.08, energy);
    const x = i * gutter + gutter * 0.1;
    const y = height - barHeight;
    ctx.fillStyle = `hsla(${state.hue + i * 8}, 90%, 62%, 0.8)`;
    ctx.fillRect(x, y, gutter * 0.8, barHeight);
  }
}

export function drawGrid(ctx, width, height, state) {
  const spacing = 34;
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(state.time * 0.00008);

  for (let x = -width; x < width; x += spacing) {
    for (let y = -height; y < height; y += spacing) {
      const dist = Math.hypot(x, y);
      const size = 4 + Math.sin(dist * 0.02 - state.time * 0.003) * 3 + state.energy * 9;
      ctx.fillStyle = `hsla(${state.hue + dist * 0.03}, 80%, 65%, 0.35)`;
      ctx.fillRect(x, y, size, size);
    }
  }

  ctx.restore();
}

