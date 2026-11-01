// [data-turn] devices start tilted away and turn to face the reader as their stage scrolls up the screen,
// overshooting a touch before they settle; the screen lights up as they land. data-turn="left" turns from the other side.
// The progress is read off the device's parent, which never moves, so the device's own transform doesn't feed back.

import { clamp, reduceMotion, register } from "./loop";

// The turn finishes once the stage's top has climbed this share of the viewport.
const TRAVEL = 0.7;
// How far past square the device swings just before it lands, as a share of the whole turn.
const OVERSHOOT = 0.08;

// A smooth turn that swings a little past the end and settles back as the progress reaches 1.
const settle = (progress: number) =>
  progress * progress * (3 - 2 * progress) + OVERSHOOT * Math.sin(Math.PI * clamp((progress - 0.55) / 0.45));

export default function initTurns(): void {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>("[data-turn]").forEach((device) => {
    register({
      update() {
        const host = device.parentElement;
        if (!host || device.hidden) return;
        const top = host.getBoundingClientRect().top;
        const progress = clamp((window.innerHeight - top) / (window.innerHeight * TRAVEL));
        device.style.setProperty("--turn", (1 - settle(progress)).toFixed(4));
        device.style.setProperty("--lit", clamp((progress - 0.75) / 0.25).toFixed(3));
      },
    });
  });
}
