export const demo2 = {
  id: "demo2",
  tier: "medium",
  name: "Grid Pressure",
  code: `
tempo(132)

kick("x..x x.x. x..x x.x.")
hat(".x.x xxxx .x.x xxxx")
clap(".... x... .... x...")
bass("{a1 . c2 . e2 . g2 .}*2")
lead("[c4 e4 g4] . [d4 f4 a4] .")
  .wave("square")
  .gain(0.1)
pad("{a2 . f2 .}*2")
  .gain(0.05)

visual("grid")
  .react("bass")
  .color("lime")
  .trails(0.9)
  .background("ocean")

on("key:a", () => burst("diamond", 32))
on("mouse", p => synth("spark").play(1 - p.y))
`
};
