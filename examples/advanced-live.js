export const advancedLive = {
  id: "advanced-live",
  tier: "advanced",
  name: "Live Tweaks",
  code: `
tempo(118)

fx("delay", 0.24)
fx("feedback", 0.22)

kick("x... x.x. ..x. x.x.")
snare(".... x... .... x...")
hat(".xxx xxxx .xxx xxxx")

bass("{d2 . a1 . c2 . g1 .}*2")
  .gain(0.16)

lead("{d4 f4 a4 c5}*2")
  .wave("triangle")
  .gain(0.09)

visual("grid")
  .react("kick")
  .color("coral")
  .trails(0.92)
  .background("ember")

on("key:1", () => fx("filter", 800))
on("key:2", () => fx("filter", 3200))
on("key:3", () => fx("wet", 0.25))
on("space", () => {
  burst("circle", 32)
  play("a4", { instrument: "pluck", gain: 0.1 })
})
on("mouse", p => {
  fx("filter", 400 + p.x * 6000)
  synth("spark").play(p.y, { gain: 0.05 })
})
`
};
