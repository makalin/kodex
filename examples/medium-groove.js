export const mediumGroove = {
  id: "medium-groove",
  tier: "medium",
  name: "Clap Groove",
  code: `
tempo(122)

kick("x..x x..x x..x x..x")
clap(".... x..x .... x..x")
hat("x.x. x.x. x.x. x.x.")

bass("{f2 . c2 . ab1 . eb2 .}*2")
  .gain(0.15)

pluck("{c5 . eb5 . g5 . bb4 .}*2")
  .gain(0.07)

visual("grid")
  .react("clap")
  .color("lime")
  .trails(0.88)

on("key:z", () => synth("spark").play(0.5))
`
};
