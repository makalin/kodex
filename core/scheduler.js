export class Scheduler {
  constructor() {
    this.tempo = 120;
    this.lookAheadMs = 25;
    this.currentStep = 0;
    this.lastTickAt = performance.now();
    this.loops = new Map();
    this.timer = window.setInterval(() => this.tick(), this.lookAheadMs);
  }

  setTempo(tempo) {
    this.tempo = Math.max(40, Math.min(240, Number(tempo) || 120));
  }

  getStepDuration() {
    return (60 / this.tempo) / 4;
  }

  addLoop(id, steps, callback) {
    this.loops.set(id, {
      steps,
      callback
    });
  }

  removeLoop(id) {
    this.loops.delete(id);
  }

  clear() {
    this.loops.clear();
    this.currentStep = 0;
  }

  tick() {
    const now = performance.now();
    const stepDurationMs = this.getStepDuration() * 1000;

    if (now - this.lastTickAt < stepDurationMs) {
      return;
    }

    this.lastTickAt += stepDurationMs;

    for (const [, loop] of this.loops) {
      if (!loop.steps.length) {
        continue;
      }
      const index = this.currentStep % loop.steps.length;
      loop.callback(loop.steps[index], index, this.currentStep);
    }

    this.currentStep += 1;
  }

  dispose() {
    window.clearInterval(this.timer);
  }
}

