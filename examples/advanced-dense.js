export const advancedDense = {
  id: "advanced-dense",
  tier: "advanced",
  name: "Dense Stack",
  code: `
tempo(128)

fx("delay", 0.2)
fx("wet", 0.12)

kick("x.x. x..x x.x. x..x")
snare(".... x... .... x...")
hat("xxxx xxxx xxxx xxxx")
clap(".... ..x. .... ..x.")

bass("{g2 . d2 . bb1 . eb2 .}*2")
  .wave("square")
  .gain(0.12)

lead("{g4 bb4 d5 f5}*2")
  .wave("sawtooth")
  .gain(0.08)
  .detune(3)

pad("{g3 . eb3 . bb2 .}*2")
  .gain(0.04)

visual("rings")
  .react("hat")
  .color("gold")
  .energy(0.35)
  .trails(0.9)
  .background("ocean")

once(4, () => chord("eb3", { chord: "minor", gain: 0.05 }))
repeat(8, () => play("bb4", { instrument: "pluck", gain: 0.06 }))

on("mouse", p => synth("drift").play(p.x, { gain: 0.04 }))
on("key:q", () => burst("diamond", 40))
`
};
