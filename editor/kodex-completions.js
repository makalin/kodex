import { autocompletion } from "https://esm.sh/@codemirror/autocomplete@6";

const TOP_LEVEL = [
  { label: "tempo", type: "function", info: "tempo(bpm) — set global tempo (40–240)." },
  { label: "drums", type: "function", info: "drums(pattern) — layered kicks; chain .sample etc." },
  { label: "kick", type: "function", info: "kick(pattern) — drum lane; chain .gain, .every…" },
  { label: "snare", type: "function", info: "snare(pattern)" },
  { label: "hat", type: "function", info: "hat(pattern)" },
  { label: "clap", type: "function", info: "clap(pattern)" },
  { label: "bass", type: "function", info: "bass(notePattern) — monophonic bass." },
  { label: "lead", type: "function", info: "lead(notePattern) — melodic voice." },
  { label: "pad", type: "function", info: "pad(pattern) — sustained chords." },
  { label: "pluck", type: "function", info: "pluck(pattern) — short plucked notes." },
  { label: "visual", type: "function", info: 'visual("rings"|"grid"|"bars") — canvas mode.' },
  { label: "fx", type: "function", info: 'fx("delay"|"feedback"|"filter"|"wet"|"master", value)' },
  { label: "on", type: "function", info: 'on("space"|"key:a"|"mouse", handler)' },
  { label: "burst", type: "function", info: 'burst("circle"|"diamond", count)' },
  { label: "once", type: "function", info: "once(beats, callback) — fire once after N beats." },
  { label: "repeat", type: "function", info: "repeat(beats, callback) — loop callback every N beats." },
  { label: "wait", type: "function", info: "wait(beats) — async delay (use inside async)." },
  { label: "play", type: "function", info: "play(note, { instrument, gain, … })" },
  { label: "chord", type: "function", info: 'chord("g3", { chord: "major", gain })' },
  { label: "random", type: "function", info: "random(min, max)" },
  { label: "stop", type: "function", info: "stop() — clear loops and timers." },
  { label: "synth", type: "function", info: 'synth("spark").play(value, options)' },
  { label: "log", type: "function", info: "log(...args) — console output." },
  { label: "meter", type: "function", info: "meter() — { tempo, pointer, audioState }." }
];

const CHAIN_NOTE = [
  { label: "wave", type: "method", info: '"sine"|"square"|"saw"|"triangle"' },
  { label: "delay", type: "method", info: "Send value to master delay time." },
  { label: "gain", type: "method", info: "Voice gain." },
  { label: "attack", type: "method", info: "Amp envelope attack." },
  { label: "release", type: "method", info: "Amp envelope release." },
  { label: "detune", type: "method", info: "Cents detune." },
  { label: "duration", type: "method", info: "Note length." },
  { label: "chord", type: "method", info: "Pad chord name (pad only)." },
  { label: "width", type: "method", info: "Pulse width (pad)." },
  { label: "tone", type: "method", info: "Brightness (pluck)." },
  { label: "every", type: "method", info: "every(n, mutate) — mutate options every n steps." }
];

const CHAIN_VISUAL = [
  { label: "react", type: "method", info: 'react("kick"|"snare"|event) — bind visual pulse.' },
  { label: "color", type: "method", info: 'color("cyan"|"gold"|"coral"|…)' },
  { label: "trails", type: "method", info: "trails(0–1) — motion blur amount." },
  { label: "energy", type: "method", info: "energy(0–1) — visual intensity." },
  { label: "background", type: "method", info: 'background("ocean"|"ember"|"dusk"|…)' }
];

const SYNTH_PLAY = [
  { label: "play", type: "method", info: "play(0–1 or note string, { gain, wave, duration… })" }
];

function filterOptions(list, prefix) {
  const p = prefix.toLowerCase();
  return list.filter((o) => o.label.toLowerCase().startsWith(p));
}

function kodexCompletionSource(context) {
  const word = context.matchBefore(/[\w.]+/);
  if (!word || (!word.text && !context.explicit)) {
    return null;
  }

  const text = word.text;
  const from = word.from;

  if (text.includes(".")) {
    const idx = text.lastIndexOf(".");
    const after = text.slice(idx + 1);
    const beforeDot = text.slice(0, idx);
    const rootMatch = beforeDot.match(/^(\w+)/);
    const root = rootMatch ? rootMatch[1] : "";

    let pool = CHAIN_NOTE;
    if (root === "visual") {
      pool = CHAIN_VISUAL;
    } else if (root === "synth") {
      pool = SYNTH_PLAY;
    }

    const matches = filterOptions(pool, after);
    if (!matches.length) {
      return null;
    }
    return {
      from: from + idx + 1,
      options: matches
    };
  }

  const matches = filterOptions(TOP_LEVEL, text);
  if (!matches.length) {
    return null;
  }
  return { from, options: matches };
}

export const kodexAutocomplete = autocompletion({
  override: [kodexCompletionSource],
  activateOnTyping: true,
  maxRenderedOptions: 40
});
