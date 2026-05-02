export const simpleVisual = {
  id: "simple-visual",
  tier: "simple",
  name: "Kick + Rings",
  code: `
tempo(100)

kick("x... ..x. x... ..x.")

visual("rings")
  .react("kick")
  .color("cyan")
  .trails(0.9)
`
};
