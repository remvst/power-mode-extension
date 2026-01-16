const slider = document.getElementById("power-level") as HTMLInputElement;
const valueDisplay = document.getElementById("power-value")!;

chrome.storage.local.get("powerLevel", (result) => {
  const level = result.powerLevel ?? 50;
  slider.value = String(level);
  valueDisplay.textContent = String(level);
});

slider.addEventListener("input", () => {
  const level = Number(slider.value);
  valueDisplay.textContent = String(level);
  chrome.storage.local.set({ powerLevel: level });
});
