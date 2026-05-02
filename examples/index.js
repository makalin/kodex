import { demo1 } from "./demo1.js";
import { demo2 } from "./demo2.js";
import { demo3 } from "./demo3.js";
import { demo4 } from "./demo4.js";
import { simpleBeat } from "./simple-beat.js";
import { simplePad } from "./simple-pad.js";
import { simpleVisual } from "./simple-visual.js";
import { mediumSwells } from "./medium-swells.js";
import { mediumGroove } from "./medium-groove.js";
import { advancedDense } from "./advanced-dense.js";
import { advancedLive } from "./advanced-live.js";

export const EXAMPLES = [
  simpleBeat,
  simplePad,
  simpleVisual,
  demo1,
  demo2,
  demo3,
  mediumSwells,
  mediumGroove,
  demo4,
  advancedDense,
  advancedLive
];

export const DEFAULT_EXAMPLE_ID = simpleBeat.id;

export const EXAMPLE_TIERS = [
  { id: "simple", label: "Simple" },
  { id: "medium", label: "Medium" },
  { id: "advanced", label: "Advanced" }
];

/**
 * @param {HTMLSelectElement} selectEl
 */
export function populateExampleSelect(selectEl) {
  selectEl.replaceChildren();
  for (const tier of EXAMPLE_TIERS) {
    const group = EXAMPLES.filter((ex) => ex.tier === tier.id);
    if (!group.length) {
      continue;
    }
    const og = document.createElement("optgroup");
    og.label = tier.label;
    for (const ex of group) {
      const option = document.createElement("option");
      option.value = ex.id;
      option.textContent = ex.name;
      og.append(option);
    }
    selectEl.append(og);
  }
}
