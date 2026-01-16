let AMPLITUDE = 50;

chrome.storage.local.get("powerLevel", (result) => {
  AMPLITUDE = result.powerLevel ?? 50;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.powerLevel) {
    AMPLITUDE = changes.powerLevel.newValue;
  }
});

function shake() {
  let t = 0;
  for (; t < 0.2; t += 1 / 60) {
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
