export const demo4 = {
  id: "demo4",
  tier: "advanced",
  name: "Performance Toolkit",
  code: `
tempo(126)

fx("delay", 0.22)
fx("feedback", 0.35)
fx("wet", 0.18)

kick("x... x..x x... x.x.")
snare(".... x... .... x...")
hat("x.x. xxxx x.x. xxxx")
clap(".... .... x... ....")

bass("{d2 . f2 . a1 . c2 .}*2")
  .wave("triangle")
  .gain(0.16)

pad("{d3 . bb2 . g2 . a2 .}*2")
  .wave("saw")
  .gain(0.05)

lead("{d4 f4 a4 c5}*2")
  .wave("square")
  .gain(0.09)
  .detune(5)

visual("rings")
  .react("kick")
  .color("gold")
  .trails(0.91)
  .energy(0.25)
  .background("dusk")

once(8, () => chord("g3", { chord: "major", gain: 0.06 }))
repeat(4, () => synth("drift").play("d5", { gain: 0.03, tone: 2200 }))

on("space", () => {
  burst("circle", 28)
  play("f5", { instrument: "pluck", gain: 0.12 })
})

on("key:d", () => {
  fx("filter", 1800)
  chord("bb2", { chord: "sus2", gain: 0.07 })
})

on("mouse", p => synth("spark").play(p.x, { gain: 0.05 + p.y * 0.08 }))
`
};
