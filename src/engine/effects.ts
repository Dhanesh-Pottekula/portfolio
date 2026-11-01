// Page-wide behaviour driven by markup:
//   .sky canvas          cold stars, painted once per resize; warm glinting stars added as DOM
//   data-reveal          gets .is-in the first time it enters
//   data-draw            an svg path/line that draws itself once on enter (length measured here)
//   section[id]          lights the matching .bar__nav link while it holds the middle of the screen

import { reduceMotion, register } from "./loop";

const WARM_STARS = 14;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function sky() {
  const root = document.querySelector<HTMLElement>(".sky");
  const canvas = root?.querySelector("canvas");
  const ctx = canvas?.getContext("2d");
  if (!root || !canvas || !ctx) return;

  const paint = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const rand = seeded(7);
    const count = Math.round((w * h) / 3500);
    for (let i = 0; i < count; i++) {
      const r = 0.35 + rand() * rand() * 0.95;
      ctx.globalAlpha = 0.2 + rand() * 0.6;
      ctx.fillStyle = rand() > 0.9 ? "#ffe6c2" : "#ffffff";
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  paint();
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(paint, 120);
  });

  const rand = seeded(42);
  const warm = Array.from({ length: WARM_STARS }, (_, i) => {
    const star = document.createElement("i");
    star.className = "sky__warm" + (i % 4 === 0 ? " is-glint" : "");
    star.style.left = `${4 + rand() * 92}%`;
    star.style.top = `${4 + rand() * 92}%`;
    star.style.setProperty("--tw", `${4 + rand() * 5}s`);
    star.style.setProperty("--td", `${-rand() * 8}s`);
    const depth = 0.3 + rand() * 0.7;
    root.append(star);
    return { star, depth };
  });

  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
  let raf = 0;
  window.addEventListener("pointermove", (event) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const dx = event.clientX / window.innerWidth - 0.5;
      const dy = event.clientY / window.innerHeight - 0.5;
      for (const { star, depth } of warm) {
        star.style.setProperty("--px", `${(dx * 12 * depth).toFixed(1)}px`);
        star.style.setProperty("--py", `${(dy * 12 * depth).toFixed(1)}px`);
      }
    });
  });
}

function bar() {
  const el = document.querySelector<HTMLElement>(".bar");
  if (!el) return;
  register({
    update() {
      el.classList.toggle("is-scrolled", window.scrollY > 24);
    },
  });

  const links = new Map<string, HTMLAnchorElement>();
  el.querySelectorAll<HTMLAnchorElement>(".bar__nav a").forEach((a) => links.set(a.hash.slice(1), a));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a, id) => {
          const on = id === entry.target.id;
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "location");
          else a.removeAttribute("aria-current");
        });
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  document.querySelectorAll<HTMLElement>("main > section[id]").forEach((section) => observer.observe(section));
}

function reveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );

  document.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((path) => {
    const length = typeof path.getTotalLength === "function" ? path.getTotalLength() : 1000;
    path.style.setProperty("--len", `${Math.ceil(length) + 2}`);
    const delay = path.getAttribute("data-draw");
    if (delay) path.style.transitionDelay = `${delay}ms`;
  });

  const pending = new Set<Element>();
  document.querySelectorAll("[data-reveal], [data-draw]").forEach((el) => {
    if (reduceMotion) el.classList.add("is-in");
    else {
      observer.observe(el);
      pending.add(el);
    }
  });

  // A nav jump can skip an element without it ever intersecting; anything already above the fold counts as seen.
  register({
    update() {
      if (!pending.size) return;
      for (const el of pending) {
        if (el.classList.contains("is-in")) pending.delete(el);
        else if (el.getBoundingClientRect().bottom < 0) {
          el.classList.add("is-in");
          observer.unobserve(el);
          pending.delete(el);
        }
      }
    },
  });
}

export default function initEffects(): void {
  sky();
  bar();
  reveals();
}
