export const demo3 = {
  id: "demo3",
  tier: "medium",
  name: "Coral Bars",
  code: `
tempo(110)

kick("x... ..x. x... ..x.")
snare(".... x... .... x...")
hat(".x.. .x.x .x.. .x.x")
bass("{f1 ab1 c2 eb2}*2")
lead("c4? . eb4? . g4? . bb4?")
  .wave("triangle")
  .delay(0.16)
pluck("{c5 . g4 . bb4 . g4 .}*2")
  .gain(0.08)

visual("bars")
  .react("lead")
  .color("coral")
  .trails(0.88)
  .background("ember")

on("space", () => burst("circle", 18))
on("key:s", () => synth("spark").play(0.75))
`
};
