import { DEFAULTS } from "../shared/defaults";

const powerSlider = document.getElementById("power-level") as HTMLInputElement;
const powerInput = document.getElementById("power-value") as HTMLInputElement;
const durationSlider = document.getElementById("duration") as HTMLInputElement;
const durationInput = document.getElementById("duration-value") as HTMLInputElement;
const resetButton = document.getElementById("reset")!;

function updateUI(powerLevel: number, duration: number) {
  powerSlider.value = String(powerLevel);
  powerInput.value = String(powerLevel);
  durationSlider.value = String(duration);
  durationInput.value = String(duration);
}

chrome.storage.local.get(["powerLevel", "duration"], (result) => {
  updateUI(result.powerLevel ?? DEFAULTS.powerLevel, result.duration ?? DEFAULTS.duration);
});

powerSlider.addEventListener("input", () => {
  const level = Number(powerSlider.value);
  powerInput.value = String(level);
  chrome.storage.local.set({ powerLevel: level });
});

powerInput.addEventListener("input", () => {
  const level = Number(powerInput.value);
  powerSlider.value = String(level);
  chrome.storage.local.set({ powerLevel: level });
});

durationSlider.addEventListener("input", () => {
  const duration = Number(durationSlider.value);
  durationInput.value = String(duration);
  chrome.storage.local.set({ duration });
});

durationInput.addEventListener("input", () => {
  const duration = Number(durationInput.value);
  durationSlider.value = String(duration);
  chrome.storage.local.set({ duration });
});

resetButton.addEventListener("click", () => {
  updateUI(DEFAULTS.powerLevel, DEFAULTS.duration);
  chrome.storage.local.set({
    powerLevel: DEFAULTS.powerLevel,
    duration: DEFAULTS.duration,
  });
});
