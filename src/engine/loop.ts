// One requestAnimationFrame per scroll or resize, shared by every part of the
// page. A part reads layout in measure() and writes styles in update(), so
// reads and writes never interleave.

export interface Part {
  measure?(): void;
  update(): void;
}

const parts: Part[] = [];
let scheduled = 0;

export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeBack = (t: number) => {
  const c = 1.6;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

export function register(part: Part) {
  parts.push(part);
}

function run() {
  scheduled = 0;
  parts.forEach((part) => part.update());
}

export function schedule() {
  if (!scheduled) scheduled = requestAnimationFrame(run);
}

function measure() {
  parts.forEach((part) => part.measure?.());
  schedule();
}

export function start() {
  measure();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure, { once: true });
  document.fonts?.ready.then(measure);
}

// Calls back once when the element first enters the viewport, then every time
// it enters or leaves, with the current state.
export function onVisible(el: Element, callback: (visible: boolean) => void, threshold = 0.35) {
  const observer = new IntersectionObserver(([entry]) => callback(entry.isIntersecting && entry.intersectionRatio >= threshold * 0.98), { threshold: [0, threshold] });
  observer.observe(el);
  return () => observer.disconnect();
}
