# 🚀 KODEX

**350 char desc:**
KODEX is a browser-based live coding engine for music, visuals, and real-time interaction. Write small scripts to generate beats, control synths, spawn graphics, and react to input instantly. A hybrid between a coding language, audio engine, and visual performance tool.

---

# 🧠 Core Concept

> **KODEX = live coding runtime (like a tiny OS)**

Everything is driven by code:

* sound
* visuals
* input
* timing
* events

---

# ⚙️ Minimal Engine Architecture

```txt
KODEX Runtime
├── scheduler (timing / bpm)
├── parser (script → AST)
├── audio engine (WebAudio)
├── visual engine (Canvas/WebGL)
├── input layer (keyboard/mouse/MIDI)
├── state store (shared reactive data)
```

---

# 🔥 Core Script Language (simple but powerful)

## Example

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

---

# 🎧 Audio Engine (JS)

```js
const ctx = new AudioContext()

function kick() {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.frequency.setValueAtTime(120, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1)

  gain.gain.setValueAtTime(1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.2)
}
```

---

# 🎨 Visual Engine (Canvas)

```js
const canvas = document.querySelector("canvas")
const ctx2d = canvas.getContext("2d")

function drawCircle(x, y, r, color) {
  ctx2d.beginPath()
  ctx2d.arc(x, y, r, 0, Math.PI * 2)
  ctx2d.fillStyle = color
  ctx2d.fill()
}
```

---

# 🧩 Reactive Binding (important)

```js
audio.on("kick", energy => {
  visual.scale("rings", energy * 2)
})
```

---

# 🎮 Input System

```js
on("key:a", () => drums("x.x.x.x."))
on("mouse", p => synth("spark").play(p.x))
```

---

# 🧬 Pattern Engine (lightweight)

```js
parse("x..x")      // basic
parse("x?x?")      // probability
parse("{a b c}")   // sequence
parse("[ab]")      // random
parse("x*4")       // repeat
```

---

# 📁 Project Structure

```txt
kodex/
  index.html
  main.js

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

  examples/
    demo1.js
```

---

# 🧱 index.html (starter)

```html
<!DOCTYPE html>
<html>
<head>
  <title>KODEX</title>
  <style>
    body { margin:0; background:black; color:#0f0; font-family:monospace; }
    textarea { width:100%; height:200px; background:black; color:#0f0; }
    canvas { display:block; }
  </style>
</head>
<body>

<textarea id="code">
tempo(128)
drums("x... x.x.")
</textarea>

<canvas id="gfx"></canvas>

<script src="main.js"></script>
</body>
</html>
```

---

# 🧠 main.js (core loop)

```js
import { run } from "./core/runtime.js"

const editor = document.getElementById("code")

function update() {
  run(editor.value)
}

setInterval(update, 500)
```

---

# ⚡ What makes KODEX different

* not just sequencer → **runtime system**
* visuals are native (not plugin)
* input is first-class
* script = everything
* can evolve into:

  * VJ tool
  * live performance engine
  * game-like music system

---

If you want the real power move:

👉 we turn KODEX into
**“mini Ableton + Tidal + Hydra in browser”**
