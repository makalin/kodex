const NOTE_TO_SEMITONE = {
  c: 0,
  "c#": 1,
  db: 1,
  d: 2,
  "d#": 3,
  eb: 3,
  e: 4,
  f: 5,
  "f#": 6,
  gb: 6,
  g: 7,
  "g#": 8,
  ab: 8,
  a: 9,
  "a#": 10,
  bb: 10,
  b: 11
};

function tokenizePattern(pattern) {
  return pattern
    .replace(/\s+/g, " ")
    .trim()
    .match(/\{[^}]+\}\*\d+|\{[^}]+\}|x|\.(?:\d+)?|\?|\[[^\]]+\]|[^\s]+/g) ?? [];
}

function parseChoice(token) {
  const inner = token.slice(1, -1).trim();
  if (inner.includes(" ")) {
    return inner.split(/\s+/).filter(Boolean);
  }
  return inner.split("").filter(Boolean);
}

export function expandPattern(pattern) {
  const steps = [];
  const tokens = tokenizePattern(pattern);

  for (const token of tokens) {
    if (token.startsWith("{") && token.includes("}*")) {
      const [body, repeatRaw] = token.split("*");
      const repeat = Number.parseInt(repeatRaw, 10) || 1;
      const innerTokens = body.slice(1, -1).trim().split(/\s+/);
      for (let i = 0; i < repeat; i += 1) {
        steps.push(...innerTokens);
      }
      continue;
    }

    if (token.startsWith("{")) {
      steps.push(...token.slice(1, -1).trim().split(/\s+/));
      continue;
    }

    if (token.startsWith("[")) {
      const options = parseChoice(token);
      steps.push(options[Math.floor(Math.random() * options.length)] ?? ".");
      continue;
    }

    if (token === "?") {
      steps.push(Math.random() > 0.5 ? "x" : ".");
      continue;
    }

    if (token.endsWith("?")) {
      const value = token.slice(0, -1);
      steps.push(Math.random() > 0.5 ? value : ".");
      continue;
    }

    steps.push(token);
  }

  return steps;
}

export function parseDrumPattern(pattern) {
  return expandPattern(pattern).map((token) => token !== ".");
}

export function parseNotePattern(pattern) {
  return expandPattern(pattern).map((token) => token === "." ? null : token);
}

export function chordToSemitones(name) {
  const chords = {
    minor: [0, 3, 7, 10],
    major: [0, 4, 7, 11],
    sus2: [0, 2, 7, 12],
    sus4: [0, 5, 7, 12],
    fifth: [0, 7, 12, 19],
    seventh: [0, 4, 7, 10]
  };

  return chords[name] ?? chords.minor;
}

export function noteToFrequency(note) {
  if (typeof note !== "string") {
    return 0;
  }

  const match = note.trim().toLowerCase().match(/^([a-g](?:#|b)?)(-?\d)$/);
  if (!match) {
    return 0;
  }

  const [, pitchClass, octaveRaw] = match;
  const semitone = NOTE_TO_SEMITONE[pitchClass];
  const octave = Number.parseInt(octaveRaw, 10);

  if (semitone == null) {
    return 0;
  }

  const midi = semitone + (octave + 1) * 12;
  return 440 * (2 ** ((midi - 69) / 12));
}
