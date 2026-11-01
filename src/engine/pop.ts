// Things that pop up out of a pencil-drawn ground as they scroll in:
//   .pop-clip     a strip with a hand-drawn ground line under it (.pop-clip--bare: no line); its [data-pop] children rise from behind it
//                 one after another (staggered by --i), then the clip is lifted so tilts and shadows can spill out
//   data-pop      rises with a springy overshoot; outside a .pop-clip it pops on its own (the pencil doodles)
//   data-count    counts up from 0 to its own text ("1,500+") as it pops
//   data-tilt     leans toward the pointer in 3D while hovered
// With reduced motion nothing moves: everything rests in place and the ground is simply drawn.

import { onVisible, reduceMotion } from "./loop";

const STAGGER_MS = 90;
const POP_MS = 900;
const COUNT_MS = 1100;
const TILT_DEG = 14;

const GROUND = `<svg class="pop-ground" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M2 12 C 40 9, 70 14, 110 11 S 180 8, 220 12 S 300 15, 340 11 S 385 10, 398 12"/><path d="M62 12 l2 -6 M66 12 l0 -8 M70 12 l-2 -5 M282 13 l2 -5 M286 13 l0 -7 M290 13 l-2 -5"/></svg>`;

function countUp(el: HTMLElement) {
  const text = el.textContent ?? "";
  const match = text.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return;
  const [, before, digits, after] = match;
  const target = Number(digits.replace(/,/g, ""));
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / COUNT_MS);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = before + Math.round(target * eased).toLocaleString("en-US") + after;
    if (k < 1) requestAnimationFrame(step);
    else el.textContent = text;
  };
  requestAnimationFrame(step);
}

function popWhenSeen(trigger: HTMLElement, pops: HTMLElement[], onDone?: () => void) {
  const stop = onVisible(trigger, (visible) => {
    if (!visible) return;
    stop();
    trigger.classList.add("is-up");
    pops.forEach((el, i) => {
      if (el.hasAttribute("data-count")) window.setTimeout(() => countUp(el), i * STAGGER_MS + 150);
    });
    window.setTimeout(() => onDone?.(), (pops.length - 1) * STAGGER_MS + POP_MS);
  }, 0.4);
}

function tilt(el: HTMLElement) {
  el.addEventListener("pointermove", (event) => {
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    el.style.setProperty("--ry", `${(x * TILT_DEG * 2).toFixed(1)}deg`);
    el.style.setProperty("--rx", `${(-y * TILT_DEG * 2).toFixed(1)}deg`);
  });
  el.addEventListener("pointerleave", () => {
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  });
}

export default function initPop(): void {
  document.querySelectorAll<HTMLElement>(".pop-clip").forEach((clip) => {
    if (!clip.classList.contains("pop-clip--bare")) clip.insertAdjacentHTML("afterend", GROUND);
    const pops = clip.matches("[data-pop]") ? [clip] : [...clip.querySelectorAll<HTMLElement>("[data-pop]")];
    pops.forEach((el, i) => el.style.setProperty("--i", String(i)));
    if (!reduceMotion) popWhenSeen(clip, pops, () => clip.classList.add("is-done"));
  });

  if (!reduceMotion) {
    document.querySelectorAll<HTMLElement>("[data-pop]").forEach((el) => {
      if (!el.closest(".pop-clip")) popWhenSeen(el, [el]);
    });
  }

  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll<HTMLElement>("[data-tilt]").forEach(tilt);
  }
}
