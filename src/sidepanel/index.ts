import { DEFAULTS } from "../shared/defaults";

const powerSlider = document.getElementById("power-level") as HTMLInputElement;
const powerValue = document.getElementById("power-value")!;
const durationSlider = document.getElementById("duration") as HTMLInputElement;
const durationValue = document.getElementById("duration-value")!;
const resetButton = document.getElementById("reset")!;

function updateUI(powerLevel: number, duration: number) {
  powerSlider.value = String(powerLevel);
  powerValue.textContent = String(powerLevel);
  durationSlider.value = String(duration);
  durationValue.textContent = String(duration);
}

chrome.storage.local.get(["powerLevel", "duration"], (result) => {
  updateUI(result.powerLevel ?? DEFAULTS.powerLevel, result.duration ?? DEFAULTS.duration);
});

powerSlider.addEventListener("input", () => {
  const level = Number(powerSlider.value);
  powerValue.textContent = String(level);
  chrome.storage.local.set({ powerLevel: level });
});

durationSlider.addEventListener("input", () => {
  const duration = Number(durationSlider.value);
  durationValue.textContent = String(duration);
  chrome.storage.local.set({ duration });
});

resetButton.addEventListener("click", () => {
  updateUI(DEFAULTS.powerLevel, DEFAULTS.duration);
  chrome.storage.local.set({
    powerLevel: DEFAULTS.powerLevel,
    duration: DEFAULTS.duration,
  });
});
