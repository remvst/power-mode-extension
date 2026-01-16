import { DEFAULTS } from "../shared/defaults";

const powerSlider = document.getElementById("power-level") as HTMLInputElement;
const powerInput = document.getElementById("power-value") as HTMLInputElement;
const durationSlider = document.getElementById("duration") as HTMLInputElement;
const durationInput = document.getElementById("duration-value") as HTMLInputElement;
const resetButton = document.getElementById("reset")!;
const domainInput = document.getElementById("domain-input") as HTMLInputElement;
const addDomainButton = document.getElementById("add-domain")!;
const domainList = document.getElementById("domain-list")!;

function updateUI(powerLevel: number, duration: number) {
  powerSlider.value = String(powerLevel);
  powerInput.value = String(powerLevel);
  durationSlider.value = String(duration);
  durationInput.value = String(duration);
}

function renderDomainList(blockedDomains: string[]) {
  domainList.innerHTML = "";
  blockedDomains.forEach((domain) => {
    const li = document.createElement("li");
    li.textContent = domain;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeDomain(domain));
    li.appendChild(removeButton);
    domainList.appendChild(li);
  });
}

function addDomain() {
  const domain = domainInput.value.trim().toLowerCase();
  if (!domain) return;

  chrome.storage.local.get(["blockedDomains"], (result) => {
    const blockedDomains: string[] = result.blockedDomains ?? [];
    if (!blockedDomains.includes(domain)) {
      blockedDomains.push(domain);
      chrome.storage.local.set({ blockedDomains });
      renderDomainList(blockedDomains);
    }
    domainInput.value = "";
  });
}

function removeDomain(domain: string) {
  chrome.storage.local.get(["blockedDomains"], (result) => {
    const blockedDomains: string[] = result.blockedDomains ?? [];
    const index = blockedDomains.indexOf(domain);
    if (index > -1) {
      blockedDomains.splice(index, 1);
      chrome.storage.local.set({ blockedDomains });
      renderDomainList(blockedDomains);
    }
  });
}

chrome.storage.local.get(["powerLevel", "duration", "blockedDomains"], (result) => {
  updateUI(result.powerLevel ?? DEFAULTS.powerLevel, result.duration ?? DEFAULTS.duration);
  renderDomainList(result.blockedDomains ?? []);
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

addDomainButton.addEventListener("click", addDomain);
domainInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addDomain();
});

resetButton.addEventListener("click", () => {
  updateUI(DEFAULTS.powerLevel, DEFAULTS.duration);
  chrome.storage.local.set({
    powerLevel: DEFAULTS.powerLevel,
    duration: DEFAULTS.duration,
  });
});
