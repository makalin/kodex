export const mediumSwells = {
  id: "medium-swells",
  tier: "medium",
  name: "Swells & Snare",
  code: `
tempo(105)

kick("x....... x...x...")
snare(".... x... .... x...")
hat("xx.xx.xx xx.xx.xx")

bass("{c2 . g1 . bb1 . eb2 .}*2")
  .wave("triangle")
  .gain(0.14)

lead("{eb4 g4 bb4}*4")
  .wave("sine")
  .gain(0.07)
  .delay(0.18)

visual("bars")
  .react("snare")
  .color("violet")
  .trails(0.85)
  .background("dusk")

on("space", () => burst("circle", 20))
`
};
