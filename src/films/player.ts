// Films: short looping demos written as plain markup with a timeline.
//
// <div class="film" data-film data-dur="9">               length in seconds
//   <div data-at="0.5" data-until="6">…</div>            .is-on while 0.5 ≤ t < 6 (no until = to the end)
//   <p data-type-at="1" data-type-dur="1.4">hello</p>     types the text out, .is-on from type-at
//   <button data-tap="3.2">ok</button>                    .is-tap for 0.4 s at 3.2 (a finger press)
//   <span data-text-at="0:NEW|3:READY">NEW</span>         swaps text at each time
//   <span data-class-at="3:is-acc|5:is-rdy"></span>       swaps one class at each time
//   <i data-past="4.5"></i>                               .is-past once t ≥ 4.5
// </div>
//
// The root also gets --t (0..1 through the film) and --time (seconds) so CSS
// can drive bars, rings and timers. With reduced motion a film rests on its
// last frame.

import { reduceMotion } from "../engine/loop";

type Steps = { at: number; value: string }[];

const parseSteps = (raw: string): Steps =>
  raw
    .split("|")
    .map((part) => {
      const [at, ...rest] = part.split(":");
      return { at: Number(at), value: rest.join(":") };
    })
    .sort((a, b) => a.at - b.at);

const stepAt = (steps: Steps, t: number) => {
  let value: string | undefined;
  for (const step of steps) if (t >= step.at) value = step.value;
  return value;
};

export interface Film {
  readonly el: HTMLElement;
  readonly duration: number;
  play(): void;
  pause(): void;
  restart(): void;
  seek(t: number): void;
  onEnd?: () => void;
}

// Only one film plays on the whole page; starting one pauses the previous and
// announces itself as `film:play` so sections can update their own state.
let current: Film | null = null;

export function createFilm(el: HTMLElement, { loop = true } = {}): Film {
  const duration = Number(el.dataset.dur) || 8;
  const shows = [...el.querySelectorAll<HTMLElement>("[data-at]")];
  const typers = [...el.querySelectorAll<HTMLElement>("[data-type-at]")].map((node) => ({
    node,
    text: node.textContent ?? "",
    at: Number(node.dataset.typeAt),
    dur: Number(node.dataset.typeDur) || 1,
  }));
  const taps = [...el.querySelectorAll<HTMLElement>("[data-tap]")];
  const texts = [...el.querySelectorAll<HTMLElement>("[data-text-at]")].map((node) => ({ node, steps: parseSteps(node.dataset.textAt!) }));
  const classes = [...el.querySelectorAll<HTMLElement>("[data-class-at]")].map((node) => ({
    node,
    steps: parseSteps(node.dataset.classAt!),
    all: parseSteps(node.dataset.classAt!).map((s) => s.value),
  }));
  const pasts = [...el.querySelectorAll<HTMLElement>("[data-past]")];

  let time = 0;
  let playing = false;
  let last = 0;
  let frame = 0;

  const render = (t: number) => {
    el.style.setProperty("--t", (t / duration).toFixed(4));
    el.style.setProperty("--time", t.toFixed(3));
    shows.forEach((node) => {
      const at = Number(node.dataset.at);
      const until = node.dataset.until ? Number(node.dataset.until) : Infinity;
      node.classList.toggle("is-on", t >= at && t < until);
    });
    typers.forEach(({ node, text, at, dur }) => {
      const k = Math.min(1, Math.max(0, (t - at) / dur));
      node.textContent = text.slice(0, Math.round(text.length * k));
      node.classList.toggle("is-on", t >= at);
      node.classList.toggle("is-typing", k > 0 && k < 1);
    });
    taps.forEach((node) => {
      const at = Number(node.dataset.tap);
      node.classList.toggle("is-tap", t >= at && t < at + 0.4);
    });
    texts.forEach(({ node, steps }) => {
      const value = stepAt(steps, t);
      if (value !== undefined && node.textContent !== value) node.textContent = value;
    });
    classes.forEach(({ node, steps, all }) => {
      const value = stepAt(steps, t);
      all.forEach((name) => name && node.classList.toggle(name, name === value));
    });
    pasts.forEach((node) => node.classList.toggle("is-past", t >= Number(node.dataset.past)));
  };

  const tick = (now: number) => {
    time += (now - last) / 1000;
    last = now;
    if (time >= duration) {
      film.onEnd?.();
      if (!loop) {
        time = duration;
        render(time);
        playing = false;
        return;
      }
      time = 0;
    }
    render(time);
    frame = requestAnimationFrame(tick);
  };

  const film: Film = {
    el,
    duration,
    play() {
      if (reduceMotion) return film.seek(duration - 0.001);
      if (playing) return;
      if (current && current !== film) current.pause();
      current = film;
      document.dispatchEvent(new CustomEvent("film:play", { detail: el }));
      playing = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    },
    pause() {
      playing = false;
      cancelAnimationFrame(frame);
    },
    restart() {
      film.seek(0);
      film.play();
    },
    seek(t: number) {
      time = Math.min(duration, Math.max(0, t));
      render(time);
    },
  };

  render(reduceMotion ? duration - 0.001 : 0);
  return film;
}
