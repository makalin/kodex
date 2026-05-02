# KODEX

**Live coding engine for music, visuals, and real-time interaction — directly in the browser.**

KODEX is a minimal, hackable runtime where code becomes sound, graphics, and behavior.
Write tiny scripts, mutate them live, and instantly hear and see the results.

---

## Overview

KODEX is not just a sequencer or synth.

It is a **live coding system** where:

* code = music
* code = visuals
* code = interaction

Everything runs in one loop, in real time.

---

## Features

* Web Audio–based synth and sampler
* Canvas-driven reactive visuals
* Lightweight pattern language for drums and notes
* Keyboard, mouse, and MIDI-style hooks in scripts
* Real-time script execution with optional autorun on edit
* Modular layout under `core/`, `audio/`, `visual/`, `input/`, `examples/`, `editor/`
* Runs in the browser; no bundler required for the app shell (see [Getting started](#getting-started))

---

## Web app (UI)

Open `index.html` via a **local HTTP server** (recommended) so ES modules and the CodeMirror CDN bundle load reliably.

* **Examples** — Patches grouped as **Simple**, **Medium**, and **Advanced** in the dropdown. Load one to replace the script, then tweak and run.
* **Script editor**
  * **Pro** — [CodeMirror 6](https://codemirror.net/) with syntax highlighting, line numbers, folding, and **KODEX-oriented autocomplete** (globals and common chain methods).
  * **Simple** — Plain textarea; same runtime, fewer editor affordances. Switch in **Settings**.
* **Editor themes & background FX** (Pro) — Several dark/light editor themes and animated shell backgrounds (CSS and optional particles). Choices persist in `localStorage`.
* **App themes** — **Settings** → app-wide palette: Dark, Light, or Ocean night (`data-app-theme` on `<html>`).
* **Help** — Toolbar links: **Script reference** opens [`howto.html`](./howto.html) in a new tab; **GitHub** points at this repo; **Settings** (gear) opens the dialog above.

---

## Example script

```js
tempo(128)

drums("x... x.x. ..x. x...")
bass("c2 . eb2 . g1 . bb1 .")

lead("{c4 eb4 g4 bb4}*2")
  .wave("saw")
  .delay(0.25)

visual("rings")
  .react("kick")
  .color("cyan")
  .trails(0.92)

on("space", () => burst("circle", 24))
```

For a fuller API walkthrough, use **howto.html** in the repo root.

---

## Philosophy

KODEX treats code as a **performable instrument**.

Instead of separating tools (DAW, visualizer, controller),
KODEX merges everything into a **single live script**.

* minimal syntax
* immediate feedback
* playful experimentation
* no heavy setup

---

## Architecture

```
KODEX Runtime
├── scheduler        (timing / BPM)
├── parser           (script → actions)
├── audio engine     (Web Audio API)
├── visual engine    (Canvas)
├── input layer      (keyboard / mouse / MIDI)
└── editor layer     (CodeMirror / textarea, themes, completions)
```

---

## Audio engine

Built on the Web Audio API:

* oscillators (sine, saw, square, triangle)
* envelope control
* sample playback
* master effects (delay, feedback, filter, wet, gain)

---

## Visual engine

* Canvas rendering and scene modes (`rings`, `grid`, `bars`, …)
* Audio-reactive styling (react, color, trails, energy, background)

---

## Input

```js
on("key:a", () => drums("x.x.x.x."))
on("mouse", p => synth("spark").play(p.x))
```

Keyboard keys emit `key:<name>` events; the stage feeds `mouse` with normalized coordinates.

---

## Pattern language (quick ref)

```
x = hit
. = rest
? = probability
* = repeat
{} = sequence
[] = random
```

```js
drums("x..x x.x. ..x.")
bass("{c2 eb2 g2 bb1}*2")
lead("c4? . g4?")
```

---

## Project structure

```
kodex/
  index.html
  howto.html
  main.js
  styles.css

  core/
    scheduler.js
    runtime.js
    parser.js

  audio/
    synth.js
    sampler.js
    effects.js

  visual/
    canvas.js
    shapes.js
    particles.js

  input/
    keyboard.js
    mouse.js
    midi.js

  editor/
    kodex-editor.js
    kodex-completions.js
    simple-editor.js
    shell-fx.js
    fx-canvas.js

  examples/
    index.js
    demo1.js … demo4.js
    simple-*.js
    medium-*.js
    advanced-*.js
```

---

## Getting started

1. Clone the repo

```bash
git clone https://github.com/frangedev/kodex
cd kodex
```

2. Serve the folder over HTTP (recommended)

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or use any static file server).

Opening `index.html` as a `file://` URL may block module or CDN loads depending on the browser.

3. No build step is required for the stock UI. The Pro editor loads **CodeMirror** and related packages from [esm.sh](https://esm.sh) at runtime (network needed on first load).

---

## Roadmap

* [x] In-browser script editor (CodeMirror + simple textarea mode)
* [x] Tiered examples and in-app script reference (`howto.html`)
* [x] Autocomplete for KODEX globals and chains (Pro editor)
* [ ] Richer pattern / mini-language features
* [ ] Deeper MIDI integration
* [ ] Optional shader / WebGL visual paths
* [ ] Save / share live sessions
* [ ] Plugin or preset packaging

---

## Inspiration

* live coding environments
* generative music systems
* creative coding tools
* demoscene aesthetics

---

## License

MIT

---

## Status

Experimental — built for exploration, performance, and fun.
