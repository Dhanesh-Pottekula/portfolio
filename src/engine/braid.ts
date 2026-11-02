// Three teal strands that braid down a timeline, meeting at every checkpoint, and draw themselves as you scroll.
//   data-braid="<selector>"   on the container; its checkpoints are the descendants matching the selector
//   data-braid-dot            take each checkpoint's ::before box (the drawn dot) instead of the element's own box
//   data-braid-amp="12"       how far the strands swing out from the line, in px
//   data-braid-min="820"      only braid when the viewport is at least this wide
//   data-braid-follow="hold"  draw along with the hold this container anchors (engine/hold.ts) instead of the scroll:
//                             with n checkpoints the strands reach checkpoint i as the hold enters its i-th step
// Wherever the strands stop, drawing or done, they thin out into nothing rather than ending on a hard edge.
// They are rebuilt whenever the container resizes (fonts landing, rows opening, breakpoints).

import { clamp, reduceMotion, register } from "./loop";
import { holdProgress } from "./hold";

const SVG_NS = "http://www.w3.org/2000/svg";
// Distance between sampled points along a strand, and the length of one full swing, in px.
const STEP = 6;
const WAVE = 150;
// The strands are drawn down to this share of the viewport height: their tip fades out mid-screen.
const READ_LINE = 0.5;
// How far above the tip the strands start fading out, in px.
const TIP_FADE = 90;
const STRANDS = [
  { phase: 0, width: 1.6, opacity: 1 },
  { phase: (2 * Math.PI) / 3, width: 1.1, opacity: 0.6 },
  { phase: (4 * Math.PI) / 3, width: 1.1, opacity: 0.4 },
];

const GLOW = { width: 6, opacity: 0.18 };
// Share of the remaining distance the tip covers each frame on its way to where the scroll puts it, so a jump
// (a wheel notch, a click on a row) glides from one checkpoint to the next instead of snapping.
const GLIDE = 0.2;

interface Point { x: number; y: number }

let braids = 0;

function checkpoint(el: HTMLElement, box: DOMRect, dot: boolean): Point {
  const r = el.getBoundingClientRect();
  if (!dot) return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
  const before = getComputedStyle(el, "::before");
  return {
    x: r.left - box.left + parseFloat(before.left) + parseFloat(before.width) / 2,
    y: r.top - box.top + parseFloat(before.top) + parseFloat(before.height) / 2,
  };
}

// One strand through every stop: straight between stops on average, swinging out and back in between them.
// Also returns how far along the strand each stop sits, so drawing can stop exactly on a checkpoint, and the length
// reached at every sampled height (the strand only ever runs downwards), so drawing can stop at a given height.
function strandPath(stops: Point[], amp: number, phase: number): { d: string; marks: number[]; depth: Depth } {
  let d = `M${stops[0].x.toFixed(1)} ${stops[0].y.toFixed(1)}`;
  const marks = [0];
  const depth: Depth = { ys: [stops[0].y], lengths: [0] };
  let length = 0;
  let last = stops[0];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    const span = b.y - a.y;
    const steps = Math.max(2, Math.round(span / STEP));
    for (let j = 1; j <= steps; j++) {
      const t = j / steps;
      const swing = amp * Math.sin(Math.PI * t) * Math.sin((2 * Math.PI * span * t) / WAVE + phase);
      const point = { x: a.x + (b.x - a.x) * t + swing, y: a.y + span * t };
      length += Math.hypot(point.x - last.x, point.y - last.y);
      last = point;
      d += ` L${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      depth.ys.push(point.y);
      depth.lengths.push(length);
    }
    marks.push(length);
  }
  return { d, marks, depth };
}

interface Depth { ys: number[]; lengths: number[] }

// How much of a strand is drawn when its tip sits at height y (host coordinates).
function lengthAtDepth({ ys, lengths }: Depth, y: number): number {
  if (y <= ys[0]) return 0;
  const last = ys.length - 1;
  if (y >= ys[last]) return lengths[last];
  let lo = 0;
  let hi = last;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (ys[mid] <= y) lo = mid;
    else hi = mid;
  }
  return lengths[lo] + ((lengths[hi] - lengths[lo]) * (y - ys[lo])) / (ys[hi] - ys[lo]);
}

// How much of the leading strand is drawn for a hold progress: checkpoint i is reached as step i begins,
// and the last step carries the strands on past the final checkpoint to their end.
function lengthForHold(progress: number, marks: number[], total: number): number {
  const checkpoints = marks.length;
  const at = progress * checkpoints;
  const i = Math.floor(at);
  if (i >= checkpoints - 1) {
    const last = marks[checkpoints - 1];
    return last + (total - last) * clamp(at - (checkpoints - 1));
  }
  return marks[i] + (marks[i + 1] - marks[i]) * (at - i);
}

function braid(host: HTMLElement) {
  const selector = host.dataset.braid ?? "";
  const dot = host.hasAttribute("data-braid-dot");
  const amp = Number(host.dataset.braidAmp ?? 12);
  const minWidth = Number(host.dataset.braidMin ?? 0);
  const followHold = host.dataset.braidFollow === "hold";
  const id = `braid-${braids++}`;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("braid");
  svg.setAttribute("aria-hidden", "true");
  // One vertical fade shared by the strands: solid above the tip, gone at the tip. Moved every frame in draw().
  svg.innerHTML = `<defs><linearGradient id="${id}-tip" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fe3c1"/><stop offset="1" stop-color="#4fe3c1" stop-opacity="0"/></linearGradient></defs>`;
  const tipFade = svg.querySelector("linearGradient")!;
  // The glow is a wide, faint copy of the leading strand underneath it. A blur filter would look the same but
  // repaint the whole SVG, which runs the height of the timeline, blurred on every scroll frame.
  const glow = document.createElementNS(SVG_NS, "path");
  glow.setAttribute("stroke-width", String(GLOW.width));
  glow.setAttribute("stroke-opacity", String(GLOW.opacity));
  glow.setAttribute("stroke", `url(#${id}-tip)`);
  svg.append(glow);
  const paths = STRANDS.map((strand) => {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("stroke-width", String(strand.width));
    path.setAttribute("stroke-opacity", String(strand.opacity));
    path.setAttribute("stroke", `url(#${id}-tip)`);
    svg.append(path);
    return path;
  });
  host.prepend(svg);
  const lengths = STRANDS.map(() => 0);
  // Where each checkpoint sits along the leading strand (the run past the last checkpoint isn't one).
  let marks: number[] = [0];
  let depth: Depth = { ys: [0], lengths: [0] };

  const paint = (drawn: number) => {
    const share = lengths[0] ? drawn / lengths[0] : 0;
    paths.forEach((path, k) => (path.style.strokeDashoffset = (lengths[k] * (1 - share)).toFixed(1)));
    glow.style.strokeDashoffset = paths[0].style.strokeDashoffset;
    const tip = paths[0].getPointAtLength(drawn).y;
    tipFade.setAttribute("y1", (tip - TIP_FADE).toFixed(1));
    tipFade.setAttribute("y2", tip.toFixed(1));
  };

  // How much of the leading strand is drawn now, and how much the scroll asks for; -1 until the first draw.
  let shown = -1;
  let target = 0;
  let frame = 0;
  const glide = () => {
    shown += (target - shown) * GLIDE;
    if (Math.abs(target - shown) < 0.5) shown = target;
    paint(shown);
    frame = shown === target ? 0 : requestAnimationFrame(glide);
  };

  const draw = () => {
    if (!host.classList.contains("has-braid")) return;
    if (reduceMotion) target = lengths[0];
    else if (followHold) target = lengthForHold(holdProgress(host), marks, lengths[0]);
    else target = Math.min(lengths[0], lengthAtDepth(depth, window.innerHeight * READ_LINE - host.getBoundingClientRect().top));
    // A rebuild can shorten the strands under the tip.
    shown = Math.min(shown, lengths[0]);
    // The first draw (and reduced motion) lands at once, so the page doesn't open with the strands growing in.
    if (reduceMotion || shown < 0) {
      shown = target;
      paint(shown);
    } else if (!frame) frame = requestAnimationFrame(glide);
  };

  const build = () => {
    const box = host.getBoundingClientRect();
    const points = [...host.querySelectorAll<HTMLElement>(selector)]
      .filter((el) => el.offsetParent !== null)
      .map((el) => checkpoint(el, box, dot));
    const on = points.length > 0 && window.innerWidth >= minWidth;
    host.classList.toggle("has-braid", on);
    if (!on) return;
    // The strands carry on a little past the last checkpoint before they fade out.
    const stops = [...points, { x: points[points.length - 1].x, y: Math.min(box.height, points[points.length - 1].y + WAVE) }];
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    svg.setAttribute("width", String(box.width));
    svg.setAttribute("height", String(box.height));
    paths.forEach((path, k) => {
      const strand = strandPath(stops, amp, STRANDS[k].phase);
      path.setAttribute("d", strand.d);
      if (k === 0) {
        glow.setAttribute("d", strand.d);
        glow.style.strokeDasharray = String(path.getTotalLength());
        marks = strand.marks.slice(0, -1);
        depth = strand.depth;
      }
      lengths[k] = path.getTotalLength();
      path.style.strokeDasharray = String(lengths[k]);
    });
    draw();
  };

  build();
  // Rows opening inside a container of fixed height move the checkpoints without resizing it, so watch them too.
  const resized = new ResizeObserver(build);
  resized.observe(host);
  host.querySelectorAll<HTMLElement>(selector).forEach((el) => resized.observe(el));
  register({ update: draw });
}

export default function initBraids(): void {
  document.querySelectorAll<HTMLElement>("[data-braid]").forEach(braid);
}
