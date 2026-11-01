// Holds: a tall block that stands still for a stretch of scrolling while something inside it plays out.
//   data-hold="<selector>"   on the block; every descendant matching the selector is an anchor. When an anchor's top
//                            reaches START of the viewport the block freezes on screen, and the next scroll distance
//                            (steps × STEP of the viewport height) drives that anchor's progress from 0 to 1, then the
//                            page moves on. The block is padded at the bottom so the page is long enough.
//   steps                    the anchor's own [data-hold-step] children count (one step per capability row)
//   data-hold-align="end"    on an anchor: freeze it by its bottom edge, at END of the viewport, instead of its top.
//                            For the last anchor, so what follows the block is already coming into view while it
//                            holds, rather than a screenful of empty runway below it.
// Each anchor receives a "hold:progress" CustomEvent (detail: 0..1) every frame; holdProgress() answers the same.
// While an anchor's steps are being scrolled through it carries .is-held, and so does the block.
// Only on wide screens and without reduced motion; elsewhere the page simply scrolls.
//
// The freeze is an offset that cancels the scroll. Set from script it lands a frame after the browser has already
// scrolled, so the whole block shakes; where the browser has scroll timelines the offset is an animation driven by
// the page's scroll position instead, moved in step with the scroll itself. Script is only the fallback.

import { clamp, reduceMotion, register } from "./loop";

// Where the anchor's top sits while frozen, the scroll per step, and the narrowest screen that holds (all in viewport units).
export const START = 0.12;
const END = 0.9;
const STEP = 0.45;
const MIN_WIDTH = 820;

// line: how far down the viewport the anchor's top sits while it is frozen.
interface Anchor { el: HTMLElement; top: number; line: number; length: number; progress: number }

const progressOf = new WeakMap<HTMLElement, number>();
const blockOf = new WeakMap<HTMLElement, Anchor[]>();

// The progress (0..1) of the hold that this anchor drives; 0 when it isn't held.
export const holdProgress = (anchor: HTMLElement): number => progressOf.get(anchor) ?? 0;

// The page scroll position at which this anchor's hold reaches the given progress, or null when it doesn't hold.
export function holdScrollTop(anchor: HTMLElement, progress: number): number | null {
  let held = 0;
  for (const entry of blockOf.get(anchor) ?? []) {
    if (entry.el === anchor) return entry.length ? entry.top - entry.line + held + progress * entry.length : null;
    held += entry.length;
  }
  return null;
}

// An element's top on the page as laid out, ignoring transforms (an anchor may slide itself while held).
function layoutTop(el: HTMLElement): number {
  let top = 0;
  for (let at: HTMLElement | null = el; at; at = at.offsetParent as HTMLElement | null) top += at.offsetTop;
  return top;
}

const scrollTimeline = typeof ScrollTimeline === "function" ? new ScrollTimeline({ source: document.documentElement }) : null;

function hold(block: HTMLElement) {
  const anchors: Anchor[] = [...block.querySelectorAll<HTMLElement>(block.dataset.hold ?? "")].map((el) => ({ el, top: 0, line: 0, length: 0, progress: 0 }));
  if (anchors.length === 0) return;
  anchors.forEach((anchor) => blockOf.set(anchor.el, anchors));
  let pin: Animation | null = null;

  // The offset as a function of scroll: flat, then rising one for one through each hold, flat again after it.
  const pinToScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const frames: Keyframe[] = [{ offset: 0, transform: "translateY(0px)" }];
    let held = 0;
    anchors.forEach((anchor) => {
      if (!anchor.length) return;
      const start = anchor.top - anchor.line + held;
      frames.push({ offset: clamp(start / max), transform: `translateY(${held}px)` });
      held += anchor.length;
      frames.push({ offset: clamp((start + anchor.length) / max), transform: `translateY(${held}px)` });
    });
    frames.push({ offset: 1, transform: `translateY(${held}px)` });
    pin = block.animate(frames, { timeline: scrollTimeline, fill: "both" });
  };

  const measure = () => {
    const on = window.innerWidth >= MIN_WIDTH;
    // Read the resting layout: no hold offset while measuring.
    pin?.cancel();
    pin = null;
    const offset = block.style.transform;
    block.style.transform = "";
    anchors.forEach((anchor) => {
      anchor.top = layoutTop(anchor.el);
      anchor.line =
        anchor.el.dataset.holdAlign === "end"
          ? window.innerHeight * END - anchor.el.offsetHeight
          : window.innerHeight * START;
      anchor.length = on ? anchor.el.querySelectorAll("[data-hold-step]").length * STEP * window.innerHeight : 0;
    });
    block.style.marginBottom = on ? `${anchors.reduce((sum, anchor) => sum + anchor.length, 0)}px` : "";
    if (scrollTimeline && on) pinToScroll();
    else block.style.transform = offset;
  };

  register({
    measure,
    update() {
      let held = 0;
      let holding = false;
      anchors.forEach((anchor) => {
        // Earlier holds already used up some scrolling, so this one starts that much later.
        const start = anchor.top - anchor.line + held;
        const used = anchor.length ? clamp(window.scrollY - start, 0, anchor.length) : 0;
        held += used;
        anchor.progress = anchor.length ? used / anchor.length : 0;
        // .is-held marks the anchor whose steps the scroll is driving right now, and the block while any is.
        const active = anchor.progress > 0 && anchor.progress < 1;
        holding ||= active;
        if (anchor.el.classList.contains("is-held") !== active) anchor.el.classList.toggle("is-held", active);
        progressOf.set(anchor.el, anchor.progress);
        anchor.el.dispatchEvent(new CustomEvent("hold:progress", { detail: anchor.progress }));
      });
      if (block.classList.contains("is-held") !== holding) block.classList.toggle("is-held", holding);
      if (!pin) block.style.transform = held ? `translateY(${held.toFixed(1)}px)` : "";
    },
  });
  // Anything that changes the page's length moves where each hold sits along the scroll, so re-measure then too.
  const resized = new ResizeObserver(measure);
  resized.observe(block);
  resized.observe(document.body);
}

export default function initHolds(): void {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>("[data-hold]").forEach(hold);
}
