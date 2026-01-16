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

function shakeElement(element: HTMLElement | null) {
  while (element) {
    const style = window.getComputedStyle(element);
    if (style.display !== "inline") break;
    element = element.parentElement;
  }

  if (element) {
    shake(element as HTMLElement);
  }
}

function randPick<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
}

window.addEventListener("click", (e) => shakeElement(e.target as HTMLElement), {
  capture: true,
});
window.addEventListener(
  "click",
  (e) => {
    addParticles({ x: e.pageX, y: e.pageY });
  },
  {
    capture: true,
  }
);

type Point = {
  x: number;
  y: number;
};

interface Particle {
  start: Point;
  end: Point;
  duration: number;
  size: number;
  rotation: number;
  color: string;
}

function addParticles(center: Point) {
  const canvas = document.createElement("canvas");
  canvas.classList.add("particles");
  canvas.width = 200;
  canvas.height = 200;
  canvas.style.left = `${center.x}px`;
  canvas.style.top = `${center.y}px`;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;

  const particles: Particle[] = [];

  let maxDuration = 0;
  for (let i = 0; i < 10; i++) {
    const particle: Particle = {
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: randInt(-100, 100),
        y: randInt(-100, 100),
      },
      duration: randFloat(300, 600),
      rotation: randFloat(0, Math.PI),
      size: randInt(5, 15),
      color: randPick(["#000", "#f00", "#ff0", "#f80"]),
    };
    particles.push(particle);

    maxDuration = Math.max(maxDuration, particle.duration);
  }

  setTimeout(() => document.body.removeChild(canvas), maxDuration);

  const start = performance.now();

  const render = (age: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    for (const { start, end, size, duration, rotation, color } of particles) {
      const ratio = age / duration;

      if (ratio > 1) continue;

      ctx.fillStyle = color;
      ctx.save();
      ctx.translate(ratio * (end.x - start.x) + start.x, ratio * (end.y - start.y) + start.y);
      ctx.rotate(rotation * Math.PI * 2);
      ctx.scale(1 - ratio, 1 - ratio);
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };

  const frame = () => {
    if (!canvas.parentElement) return;

    const age = performance.now() - start;
    render(age);
    requestAnimationFrame(frame);
  };

  frame();
}

window.addEventListener(
  "keydown",
  () => {
    const activeElement = document.activeElement as HTMLElement;
    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement.isContentEditable
    ) {
      const rect = activeElement.getBoundingClientRect();

      addParticles({
        x: rect.left + randInt(0, rect.width),
        y: rect.top + randInt(0, rect.height),
      });
    }

    shake(document.body);
  },
  {
    capture: true,
  }
);
