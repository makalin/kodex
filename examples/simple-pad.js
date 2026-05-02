export const simplePad = {
  id: "simple-pad",
  tier: "simple",
  name: "Soft Pad Drone",
  code: `
tempo(92)

pad("{c3 . g2 . bb2 . eb3 .}*2")
  .wave("saw")
  .gain(0.06)

hat("x....... x.......")
`
};
