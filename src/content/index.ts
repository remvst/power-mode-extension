import { DEFAULTS } from "../shared/defaults";
import "./content.css";

let AMPLITUDE = DEFAULTS.powerLevel;
let DURATION = DEFAULTS.duration;

chrome.storage.local.get(["powerLevel", "duration"], (result) => {
  AMPLITUDE = result.powerLevel ?? DEFAULTS.powerLevel;
  DURATION = result.duration ?? DEFAULTS.duration;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.powerLevel) {
    AMPLITUDE = changes.powerLevel.newValue;
  }
  if (changes.duration) {
    DURATION = changes.duration.newValue;
  }
});

function shake() {
  const durationSec = DURATION / 1000;
  let t = 0;
  for (; t < durationSec; t += 1 / 60) {
    setTimeout(() => {
      const x = Math.random() * AMPLITUDE - AMPLITUDE / 2;
      const y = Math.random() * AMPLITUDE - AMPLITUDE / 2;

      // document.body.classList.add('shaken');
      document.body.style.transform = `translate(${x}px, ${y}px)`;
    }, t * 1000);
  }

  setTimeout(() => {
    document.body.style.transform = `none`;
  }, t * 1000);
}

window.addEventListener("keydown", shake, {
  capture: true,
});
