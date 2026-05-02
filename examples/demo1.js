export const demo1 = {
  id: "demo1",
  tier: "medium",
  name: "Neon Pulse",
  code: `
tempo(124)

kick("x... x.x. ..x. x...")
hat(".x.x x.x. .x.x x.x.")
snare(".... x... .... x...")
bass("{c2 eb2 g2 bb1}*2")

lead("{c4 eb4 g4 bb4}*2")
  .wave("sawtooth")
  .delay(0.24)

visual("rings")
  .react("kick")
  .color("cyan")
  .trails(0.92)

on("space", () => burst("circle", 24))
on("mouse", p => synth("spark").play(p.x))
`
};
