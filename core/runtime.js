import { createMasterChain } from "../audio/effects.js";
import { Sampler } from "../audio/sampler.js";
import { SynthVoice } from "../audio/synth.js";
import { attachKeyboard } from "../input/keyboard.js";
import { attachMidi } from "../input/midi.js";
import { attachMouse } from "../input/mouse.js";
import { VisualEngine } from "../visual/canvas.js";
import {
  chordToSemitones,
  noteToFrequency,
  parseDrumPattern,
  parseNotePattern
} from "./parser.js";
import { Scheduler } from "./scheduler.js";

class ChainableInstrument {
  constructor(runtime, type, pattern, options = {}) {
    this.runtime = runtime;
    this.type = type;
    this.pattern = pattern;
    this.options = { ...options };
    this.loopId = runtime.createLoopToken(type);
    this.commit();
  }

  wave(value) {
    this.options.wave = value;
    this.commit();
    return this;
  }

  delay(value) {
    this.options.delay = value;
    this.runtime.fx.setDelay(value);
    return this;
  }

  gain(value) {
    this.options.gain = value;
    this.commit();
    return this;
  }

  attack(value) {
    this.options.attack = value;
    this.commit();
    return this;
  }

  release(value) {
    this.options.release = value;
    this.commit();
    return this;
  }

  detune(value) {
    this.options.detune = value;
    this.commit();
    return this;
  }

  duration(value) {
    this.options.duration = value;
    this.commit();
    return this;
  }

  chord(name) {
    this.options.chord = name;
    this.commit();
    return this;
  }

  width(value) {
    this.options.width = value;
    this.commit();
    return this;
  }

  tone(value) {
    this.options.tone = value;
    this.commit();
    return this;
  }

  every(interval, mutate) {
    this.options.every = { interval, mutate };
    this.commit();
    return this;
  }

  commit() {
    if (this.type === "drums") {
      this.runtime.scheduleDrums(this.pattern, this.options, this.loopId);
      return;
    }
    if (this.type === "pad") {
      this.runtime.schedulePad(this.pattern, this.options, this.loopId);
      return;
    }
    if (this.type === "pluck") {
      this.runtime.schedulePluck(this.pattern, this.options, this.loopId);
      return;
    }
    this.runtime.scheduleNotes(this.type, this.pattern, this.options, this.loopId);
  }
}

class VisualHandle {
  constructor(runtime, mode) {
    this.runtime = runtime;
    this.runtime.visual.setMode(mode);
  }

  react(eventName) {
    this.runtime.bindVisualEvent(eventName);
    return this;
  }

  color(name) {
    this.runtime.visual.setColor(name);
    return this;
  }

  trails(value) {
    this.runtime.visual.setTrails(value);
    return this;
  }

  energy(value) {
    this.runtime.visual.setEnergy(value);
    return this;
  }

  background(name) {
    this.runtime.visual.setBackground(name);
    return this;
  }
}

function normalizeWave(value) {
  return value === "saw" ? "sawtooth" : value;
}

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, parsed));
}

function createLoopId(prefix, loopSeed) {
  return `${prefix}:${loopSeed}`;
}

export function createRuntime({ canvas, onTempoChange = () => {}, onEvent = () => {} }) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextClass();
  const fx = createMasterChain(context);
  const voice = new SynthVoice(context, fx.input);
  const sampler = new Sampler(context, voice);
  const scheduler = new Scheduler();
  const visual = new VisualEngine(canvas);
  const eventHandlers = new Map();
  const visualBindings = new Set();
  const scheduledTimeouts = new Set();
  let loopSeed = 0;

  const runtime = {
    context,
    fx,
    scheduler,
    visual,
    pointer: { x: 0.5, y: 0.5 },
    unlockAudio: async () => {
      if (context.state !== "running") {
        await context.resume();
      }
    },
    stopAll: () => {
      scheduler.clear();
      scheduledTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      scheduledTimeouts.clear();
    },
    dispose: () => {
      runtime.stopAll();
      scheduler.dispose();
    },
    emit: (eventName, payload = {}) => {
      onEvent(eventName);
      if (visualBindings.has(eventName)) {
        visual.react(eventName, 1);
      }
      const handlers = eventHandlers.get(eventName) ?? [];
      handlers.forEach((handler) => handler(payload));
    },
    on: (eventName, handler) => {
      const list = eventHandlers.get(eventName) ?? [];
      list.push(handler);
      eventHandlers.set(eventName, list);
    },
    bindVisualEvent: (eventName) => {
      visualBindings.add(eventName);
    },
    clearEventHandlers: () => {
      eventHandlers.clear();
    },
    setPointer: (point) => {
      runtime.pointer = point;
      visual.setPointer(point.x, point.y);
    },
    queueTimeout: (callback, ms) => {
      const timeoutId = window.setTimeout(() => {
        scheduledTimeouts.delete(timeoutId);
        callback();
      }, ms);
      scheduledTimeouts.add(timeoutId);
      return timeoutId;
    },
    createLoopToken: (prefix) => createLoopId(prefix, loopSeed += 1),
    applyEvery: (options, stepNumber) => {
      if (!options?.every || !Number.isFinite(options.every.interval) || options.every.interval <= 0) {
        return;
      }
      if (stepNumber > 0 && stepNumber % options.every.interval === 0) {
        options.every.mutate?.(runtime);
      }
    },
    scheduleDrums: (pattern, options = {}, loopId = createLoopId("drum", loopSeed += 1)) => {
      const steps = parseDrumPattern(pattern);
      const lane = options.sample ?? "kick";
      scheduler.addLoop(loopId, steps, (active, index, stepNumber) => {
        if (!active) {
          return;
        }
        runtime.applyEvery(options, stepNumber);
        sampler.trigger(lane);
        runtime.emit(lane);
        runtime.emit("drums");
      });
    },
    scheduleNotes: (name, pattern, options = {}, loopId = createLoopId(name, loopSeed += 1)) => {
      const steps = parseNotePattern(pattern);
      scheduler.addLoop(loopId, steps, (step, index, stepNumber) => {
        if (!step) {
          return;
        }
        runtime.applyEvery(options, stepNumber);
        const frequency = noteToFrequency(step);
        if (!frequency) {
          return;
        }
        voice.trigger({
          frequency,
          type: normalizeWave(options.wave ?? (name === "bass" ? "triangle" : "sawtooth")),
          duration: options.duration ?? (name === "bass" ? 0.24 : 0.18),
          attack: options.attack ?? 0.01,
          release: options.release ?? (name === "bass" ? 0.2 : 0.26),
          gain: options.gain ?? (name === "bass" ? 0.17 : 0.13),
          detune: options.detune ?? 0
        });
        runtime.emit(name);
      });
    },
    schedulePad: (pattern, options = {}, loopId = createLoopId("pad", loopSeed += 1)) => {
      const steps = parseNotePattern(pattern);
      scheduler.addLoop(loopId, steps, (step, index, stepNumber) => {
        if (!step) {
          return;
        }
        runtime.applyEvery(options, stepNumber);
        const frequency = noteToFrequency(step);
        if (!frequency) {
          return;
        }
        voice.pad({
          frequency,
          chord: chordToSemitones(options.chord),
          gain: options.gain ?? 0.08,
          type: normalizeWave(options.wave ?? "sawtooth"),
          width: options.width ?? 0.8
        });
        runtime.emit("pad");
      });
    },
    schedulePluck: (pattern, options = {}, loopId = createLoopId("pluck", loopSeed += 1)) => {
      const steps = parseNotePattern(pattern);
      scheduler.addLoop(loopId, steps, (step, index, stepNumber) => {
        if (!step) {
          return;
        }
        runtime.applyEvery(options, stepNumber);
        const frequency = noteToFrequency(step);
        if (!frequency) {
          return;
        }
        voice.pluck({
          frequency,
          type: normalizeWave(options.wave ?? "triangle"),
          gain: options.gain ?? 0.12,
          tone: options.tone ?? 2800
        });
        runtime.emit("pluck");
      });
    },
    burst: (shape, count) => {
      visual.burst(shape, count, runtime.pointer);
    },
    triggerNote: (instrument, note, options = {}) => {
      const frequency = typeof note === "string" ? noteToFrequency(note) : Number(note);
      if (!frequency) {
        return;
      }

      if (instrument === "pad") {
        voice.pad({
          frequency,
          chord: chordToSemitones(options.chord),
          gain: options.gain ?? 0.08,
          type: normalizeWave(options.wave ?? "sawtooth"),
          width: options.width ?? 0.8
        });
      } else if (instrument === "pluck" || instrument === "drift") {
        voice.pluck({
          frequency,
          type: normalizeWave(options.wave ?? "triangle"),
          gain: options.gain ?? 0.12,
          tone: options.tone ?? 2800
        });
      } else {
        voice.trigger({
          frequency,
          type: normalizeWave(options.wave ?? "sine"),
          duration: options.duration ?? 0.18,
          attack: options.attack ?? 0.01,
          release: options.release ?? 0.22,
          gain: options.gain ?? 0.12,
          detune: options.detune ?? 0
        });
      }

      runtime.emit(instrument);
    },
    run: (script) => {
      runtime.stopAll();
      visualBindings.clear();
      runtime.clearEventHandlers();

      const api = {
        tempo(value) {
          scheduler.setTempo(value);
          onTempoChange(scheduler.tempo);
          return scheduler.tempo;
        },
        drums(pattern) {
          return new ChainableInstrument(runtime, "drums", pattern, { sample: "kick" });
        },
        kick(pattern) {
          return new ChainableInstrument(runtime, "drums", pattern, { sample: "kick" });
        },
        snare(pattern) {
          return new ChainableInstrument(runtime, "drums", pattern, { sample: "snare" });
        },
        hat(pattern) {
          return new ChainableInstrument(runtime, "drums", pattern, { sample: "hat" });
        },
        clap(pattern) {
          return new ChainableInstrument(runtime, "drums", pattern, { sample: "clap" });
        },
        bass(pattern) {
          return new ChainableInstrument(runtime, "bass", pattern, {
            wave: "triangle",
            gain: 0.18,
            duration: 0.24
          });
        },
        lead(pattern) {
          return new ChainableInstrument(runtime, "lead", pattern, {
            wave: "sawtooth",
            gain: 0.13,
            duration: 0.18
          });
        },
        pad(pattern) {
          return new ChainableInstrument(runtime, "pad", pattern, {
            wave: "sawtooth",
            chord: "minor",
            gain: 0.08
          });
        },
        pluck(pattern) {
          return new ChainableInstrument(runtime, "pluck", pattern, {
            wave: "triangle",
            gain: 0.12
          });
        },
        visual(mode) {
          return new VisualHandle(runtime, mode);
        },
        fx(type, value) {
          if (type === "delay") {
            fx.setDelay(clampNumber(value, 0.18, 0, 0.8));
          }
          if (type === "feedback") {
            fx.setFeedback(clampNumber(value, 0.28, 0, 0.92));
          }
          if (type === "filter") {
            fx.setFilter(clampNumber(value, 14000, 120, 18000));
          }
          if (type === "wet") {
            fx.setWet(clampNumber(value, 0.14, 0, 1));
          }
          if (type === "master") {
            fx.setMaster(clampNumber(value, 0.9, 0, 1.2));
          }
        },
        on(eventName, handler) {
          runtime.on(eventName, handler);
        },
        burst(shape, count) {
          runtime.burst(shape, count);
        },
        once(delayBeats, callback) {
          const ms = delayBeats * scheduler.getStepDuration() * 4 * 1000;
          runtime.queueTimeout(callback, ms);
        },
        repeat(intervalBeats, callback) {
          const ms = intervalBeats * scheduler.getStepDuration() * 4 * 1000;
          const loop = () => {
            callback();
            runtime.queueTimeout(loop, ms);
          };
          runtime.queueTimeout(loop, ms);
        },
        wait(delayBeats) {
          return new Promise((resolve) => {
            const ms = delayBeats * scheduler.getStepDuration() * 4 * 1000;
            runtime.queueTimeout(resolve, ms);
          });
        },
        play(note, options = {}) {
          runtime.triggerNote(options.instrument ?? "lead", note, options);
        },
        chord(root, options = {}) {
          runtime.triggerNote("pad", root, options);
        },
        random(min = 0, max = 1) {
          return min + Math.random() * (max - min);
        },
        stop() {
          runtime.stopAll();
        },
        synth(name) {
          return {
            play(value = 0.5, options = {}) {
              const frequency = typeof value === "string"
                ? noteToFrequency(value)
                : 140 + Number(value) * 420;
              runtime.triggerNote(name, frequency, {
                wave: options.wave ?? (name === "spark" ? "square" : "sine"),
                gain: options.gain ?? 0.08,
                duration: options.duration ?? 0.12,
                release: options.release ?? 0.1,
                attack: options.attack ?? 0.01,
                tone: options.tone,
                detune: options.detune
              });
            }
          };
        },
        log(...args) {
          console.log("[KODEX]", ...args);
        },
        meter() {
          return {
            tempo: scheduler.tempo,
            pointer: runtime.pointer,
            audioState: context.state
          };
        }
      };

      const keys = Object.keys(api);
      const values = Object.values(api);
      const evaluator = new Function(...keys, script);
      evaluator(...values);
    }
  };

  attachKeyboard(runtime);
  attachMouse(runtime, canvas);
  attachMidi(runtime);
  onTempoChange(scheduler.tempo);

  return runtime;
}
