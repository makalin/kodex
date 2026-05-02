import { drawBars, drawGrid, drawRings } from "./shapes.js";
import { ParticleField } from "./particles.js";

const COLOR_MAP = {
  cyan: 185,
  coral: 12,
  lime: 105,
  gold: 48,
  magenta: 320,
  ice: 210,
  amber: 34
};

export class VisualEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.field = new ParticleField();
    this.trails = 0.9;
    this.pulse = 0;
    this.energy = 0;
    this.time = 0;
    this.hue = COLOR_MAP.cyan;
    this.mode = "rings";
    this.lastPointer = { x: 0.5, y: 0.5 };
    this.background = "rgba(3, 10, 16, 1)";

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    const bounds = this.canvas.getBoundingClientRect();
    this.canvas.width = bounds.width * window.devicePixelRatio;
    this.canvas.height = bounds.height * window.devicePixelRatio;
    this.ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  setMode(mode) {
    this.mode = mode;
  }

  setColor(name) {
    this.hue = COLOR_MAP[name] ?? this.hue;
  }

  setTrails(value) {
    this.trails = Math.max(0.7, Math.min(0.98, value));
  }

  setEnergy(value) {
    this.energy = Math.max(0, Math.min(1.2, value));
  }

  setBackground(name) {
    const backgrounds = {
      dusk: "rgba(12, 9, 27, 1)",
      ocean: "rgba(3, 17, 26, 1)",
      ember: "rgba(24, 9, 4, 1)",
      mono: "rgba(7, 8, 12, 1)"
    };
    this.background = backgrounds[name] ?? this.background;
  }

  react(eventName, amount = 1) {
    this.energy = Math.min(1, this.energy + amount * 0.35);
    this.pulse = Math.min(1.8, this.pulse + amount * 0.6);
    if (eventName === "pointer") {
      this.field.burst(
        this.lastPointer.x * this.canvas.clientWidth,
        this.lastPointer.y * this.canvas.clientHeight,
        12,
        this.hue
      );
    }
  }

  burst(shape, count = 24, pointer = this.lastPointer) {
    const x = pointer.x * this.canvas.clientWidth;
    const y = pointer.y * this.canvas.clientHeight;
    this.field.burst(x, y, count, this.hue + (shape === "circle" ? 0 : 36));
  }

  setPointer(x, y) {
    this.lastPointer = { x, y };
  }

  animate(timestamp) {
    this.time = timestamp;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.ctx.fillStyle = this.background.replace(", 1)", `, ${1 - this.trails})`);
    this.ctx.fillRect(0, 0, width, height);

    const state = {
      pulse: this.pulse,
      energy: this.energy,
      hue: this.hue,
      time: this.time
    };

    if (this.mode === "bars") {
      drawBars(this.ctx, width, height, state);
    } else if (this.mode === "grid") {
      drawGrid(this.ctx, width, height, state);
    } else {
      drawRings(this.ctx, width, height, state);
    }

    this.field.update();
    this.field.draw(this.ctx);

    this.pulse *= 0.92;
    this.energy *= 0.94;

    requestAnimationFrame(this.animate);
  }
}
