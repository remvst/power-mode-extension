import { DEFAULTS } from "../shared/defaults";
import "./content.css";

let AMPLITUDE = DEFAULTS.powerLevel;
let DURATION = DEFAULTS.duration;
let DISABLED = false;

function isCurrentDomainBlocked(blockedDomains: string[]): boolean {
  const currentDomain = window.location.hostname.toLowerCase();
  return blockedDomains.some(
    (domain) => currentDomain === domain || currentDomain.endsWith("." + domain)
  );
}

chrome.storage.local.get(["powerLevel", "duration", "blockedDomains"], (result) => {
  AMPLITUDE = result.powerLevel ?? DEFAULTS.powerLevel;
  DURATION = result.duration ?? DEFAULTS.duration;
  DISABLED = isCurrentDomainBlocked(result.blockedDomains ?? []);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.powerLevel) {
    AMPLITUDE = changes.powerLevel.newValue;
  }
  if (changes.duration) {
    DURATION = changes.duration.newValue;
  }
  if (changes.blockedDomains) {
    DISABLED = isCurrentDomainBlocked(changes.blockedDomains.newValue ?? []);
  }
});

function shake(element: HTMLElement) {
  if (DISABLED) return;

  let t = 0;
  for (; t < DURATION; t += 1000 / 60) {
    setTimeout(() => {
      const x = Math.random() * AMPLITUDE - AMPLITUDE / 2;
      const y = Math.random() * AMPLITUDE - AMPLITUDE / 2;
      element.style.transform = `translate(${x}px, ${y}px)`;
    }, t);
  }

  setTimeout(() => {
    element.style.transform = `none`;
  }, t);
}

window.addEventListener("keydown", () => shake(document.body), {
  capture: true,
});

function shakeElement(event: MouseEvent) {
  let element: HTMLElement | null = event.target as HTMLElement;
  while (element) {
    const style = window.getComputedStyle(element);
    if (style.display !== "inline") break;
    element = element.parentElement;
  }

  shake(element as HTMLElement);
}

window.addEventListener("click", shakeElement, {
  capture: true,
});
