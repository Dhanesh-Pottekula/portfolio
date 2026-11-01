import "./projects.css";
import "../films/projects/films.css";
import shell from "./projects.html?raw";
import { createFilm, type Film } from "../films/player";
import { onVisible, reduceMotion } from "../engine/loop";
import lumenFilm from "../films/projects/lumen.html?raw";
import perplexityFilm from "../films/projects/perplexity.html?raw";
import statuspulseFilm from "../films/projects/statuspulse.html?raw";
import kilnicFilm from "../films/projects/kilnic.html?raw";
import motioneaseFilm from "../films/projects/motionease.html?raw";
import reelshareFilm from "../films/projects/reelshare.html?raw";
import fitnessFilm from "../films/projects/fitness.html?raw";

type Accent = "coral" | "sun" | "teal";
// The bento ranks projects by depth: large spans the row, medium takes half, small a quarter (and drops the long line).
type Size = "large" | "medium" | "small";

interface Project {
  id: string;
  name: string;
  year: string;
  what: string;
  stat: string;
  line: string;
  // What I built, point by point, each with its number; replaces the line on the cards that have them.
  points?: string[];
  badge?: { text: string; signal: boolean };
  tags: string[];
  links: { kind: "code" | "live"; href: string }[];
  film: string;
  filmLabel: string;
  filmTitle: string;
  accent: Accent;
  size: Size;
}

const GITHUB = "https://github.com/Dhanesh-Pottekula";

// Shared with the other film sections: whoever starts a film announces it, everyone else pauses theirs.
const FILM_PLAY_EVENT = "film:play";

const projects: Project[] = [
  {
    id: "lumen",
    name: "Lumen",
    year: "2026",
    what: "Text-to-video engine for language models.",
    stat: "solo · 64 commits · 4 packages",
    line: "The model writes the scene; Lumen validates it, repairs what it can, drops what it can't, and renders a frame-accurate animated video, with narration synced to the word. Every frame is a pure function of time, so a video scrubs, replays and exports identically.",
    points: [
      "Every frame is a pure function of time, so a video scrubs, replays and exports identically, down to <b>MP4</b> rendered in the browser (WebCodecs, H.264 + AAC).",
      "A <b>4-stage</b> compile pipeline (strict schema, semantic checks, layout, geometry repair) fixes, trims or rejects each scene, so one bad scene never blanks a video.",
      "<b>17</b> animation modules: draw-on strokes, camera, charts, maps, kinetic type, shape morphing and a math typesetter.",
      "Narration synced to the word, and every label placed by one solver that avoids drawn outlines, at <b>12 pt</b> minimum and <b>4.5:1</b> contrast.",
      "Packaged as <b>4</b> npm packages with CI and a signed release workflow (publish pending); it powers AiRA's realtime text-to-video.",
    ],
    badge: { text: "solo-built · open source", signal: true },
    tags: ["typescript", "canvas", "schema-validated scenes"],
    links: [{ kind: "code", href: `${GITHUB}/Lumen` }],
    film: lumenFilm,
    filmLabel: "Lumen demo: a scene is written as JSON line by line while the engine draws a sun, an orbit and a label beside it, then the narration lights up word by word.",
    filmTitle: "lumen · scene.json",
    accent: "sun",
    size: "large",
  },
  {
    id: "perplexity",
    name: "Perplexity Mini",
    year: "2025",
    what: "My own answer engine, over a web index that refreshes itself.",
    stat: "~3.3k lines · 4 services in Docker Compose",
    line: "A queue-fed headless-browser crawler reads the topics you follow, embeds them into a vector index, and a local model answers with numbered sources.",
    points: [
      "A Redis queue feeds a Playwright crawler: one shared headless Chromium, <b>10</b> pages at a time, one hop out from every seed.",
      "Pages are cut into <b>500</b>-character chunks, embedded as <b>384</b>-dimension vectors and stored in Qdrant.",
      "An LLM tags each page with <b>3–5</b> topics, and every midnight each topic seeds <b>10</b> fresh URLs, so the index refreshes itself.",
      "Answers come from a local Llama 3.1 8B, load-balanced across <b>2</b> Ollama servers by nginx and sent over SSE.",
    ],
    tags: ["playwright", "redis", "fastapi", "qdrant", "ollama", "docker"],
    links: [{ kind: "code", href: `${GITHUB}/perplexity_mini` }],
    film: perplexityFilm,
    filmLabel: "Perplexity Mini demo: pages for a followed topic are queued, crawled, chunked and embedded, then an answer arrives with numbered sources.",
    filmTitle: "perplexity mini · search",
    accent: "sun",
    size: "medium",
  },
  {
    id: "reelshare",
    name: "reel_share",
    year: "2026",
    what: "Playable posts for a vertical feed.",
    stat: "~17.7k lines · built AI-first, against written plans",
    line: "Playable posts: 17 tiny web games for a vertical feed, with a strict game lifecycle, game bots and 18 test files. Built AI-first, against written plans.",
    points: [
      "<b>17</b> games behind one registry, each loaded on demand: <b>9</b> DOM, <b>5</b> Canvas 2D and <b>3</b> Babylon.js 3D.",
      "Every game runs on a strict lifecycle state machine (<b>9</b> states, guarded transitions) with safe pause and teardown.",
      "Bots think in layers: a Yuka state machine picks the intent, a Recast navmesh plans the route, and the game's rules check every move.",
      "A versioned host bridge, so the same build can run inside a Flutter WebView.",
      "Seeded test mode, with <b>13</b> Vitest suites and <b>5</b> Playwright end-to-end specs behind one <code>npm run check</code>.",
    ],
    badge: { text: "ai-assisted", signal: true },
    tags: ["canvas", "babylon.js", "vitest", "playwright"],
    links: [{ kind: "code", href: `${GITHUB}/reel_share` }],
    film: reelshareFilm,
    filmLabel: "reel_share demo: a phone feed swipes between three tiny playable games.",
    filmTitle: "reel_share · feed",
    accent: "coral",
    size: "medium",
  },
  {
    id: "kilnic",
    name: "Kilnic",
    year: "2026",
    what: "Clinic platform backend, built with a friend.",
    stat: "4 services over gRPC",
    line: "Per-clinic roles and permissions with an audit log. An auth server whose refresh tokens rotate and revoke every session on reuse. Medicine search that stays in sync after each write. Four services talking over gRPC.",
    badge: { text: "built with a friend · not shipped", signal: false },
    tags: ["django", "grpc", "postgres", "qdrant"],
    links: [],
    film: kilnicFilm,
    filmLabel: "Kilnic demo: an admin flips clinic permissions, then a reused refresh token revokes every open session.",
    filmTitle: "kilnic · roles",
    accent: "teal",
    size: "small",
  },
  {
    id: "statuspulse",
    name: "StatusPulse",
    year: "2025",
    what: "Live status pages for teams.",
    stat: "~9.9k lines in 3 days, still live",
    line: "Status pages for teams, built in a three-day take-home and still live: orgs with roles and single-use invites, incidents with severity, an audit timeline, and a public page that updates over WebSockets with an HTTP fallback.",
    tags: ["react", "redux", "django rest", "websockets"],
    links: [
      { kind: "live", href: "https://plivo-status-monitor-frontend.onrender.com" },
      { kind: "code", href: `${GITHUB}/Plivo-status-monitor` },
    ],
    film: statuspulseFilm,
    filmLabel: "StatusPulse demo: a service drops to degraded, an incident is posted and updated, then it is resolved and the uptime bar recovers.",
    filmTitle: "statuspulse · acme status",
    accent: "coral",
    size: "small",
  },
  {
    id: "motionease",
    name: "MotionEase",
    year: "2024–25",
    what: "Desktop overlay that eases motion sickness.",
    stat: "pose model on-device, in a Web Worker",
    line: "A see-through, click-through desktop overlay: it tracks your head through the webcam with on-device pose detection and moves reference dots to match, so the screen agrees with what your body feels.",
    tags: ["electron", "tensorflow.js"],
    links: [{ kind: "code", href: `${GITHUB}/MotionEase` }],
    film: motioneaseFilm,
    filmLabel: "MotionEase demo: a pose skeleton leans and an on-screen horizon tilts to match it, then settles level.",
    filmTitle: "motionease · overlay",
    accent: "teal",
    size: "small",
  },
  {
    id: "fitness",
    name: "Fitness tracker",
    year: "2026",
    what: "On-device app for spends, nutrition and cycle.",
    stat: "built in 4 days by directing an AI agent",
    line: "An on-device phone app for spends, nutrition and cycle tracking, with backup and de-duplicating import. Built by directing an AI agent through written specs.",
    badge: { text: "agent-built", signal: true },
    tags: ["expo", "react native"],
    links: [{ kind: "code", href: `${GITHUB}/fitness-tracker` }],
    film: fitnessFilm,
    filmLabel: "Fitness tracker demo: the day's spends stack up, rings fill for spends, protein and cycle, and an import skips duplicates.",
    filmTitle: "fitness tracker · today",
    accent: "teal",
    size: "small",
  },
];

const linkMarkup = (project: Project) =>
  project.links
    .map(({ kind, href }) => {
      const label = kind === "code" ? `${project.name} code on GitHub` : `${project.name} live`;
      return `<a class="pill${kind === "live" ? " pill--signal" : ""}" href="${href}" target="_blank" rel="noopener" aria-label="${label}">${kind} ↗</a>`;
    })
    .join("");

const cardMarkup = (project: Project) => `
  <article class="pj-card pj-card--${project.size}" id="pj-${project.id}" aria-labelledby="pj-${project.id}-name">
    <div class="pj-card__text">
      <p class="pj-card__year">${project.year}</p>
      <h3 class="pj-card__name" id="pj-${project.id}-name">${project.name}</h3>
      <p class="pj-card__what">${project.what}</p>
      <p class="pj-card__stat">${project.stat}</p>
      ${
        project.points
          ? `<ul class="pj-card__points">${project.points.map((point) => `<li>${point}</li>`).join("")}</ul>`
          : project.size === "small" ? "" : `<p class="pj-card__line">${project.line}</p>`
      }
      <ul class="chips">${
        project.badge ? `<li${project.badge.signal ? ' class="chip--signal"' : ""}>${project.badge.text}</li>` : ""
      }${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
      ${project.links.length ? `<p class="pills pj-card__links">${linkMarkup(project)}</p>` : ""}
    </div>
    <div class="pj-well" data-accent="${project.accent}" role="img" aria-label="${project.filmLabel}">
      <div class="pj-well__bar" aria-hidden="true"><i></i><i></i><i></i><span>${project.filmTitle}</span></div>
      <div class="pj-well__body">${project.film}</div>
    </div>
  </article>`;

export default function mount(el: HTMLElement): void {
  el.innerHTML = shell;

  el.querySelector("[data-pj-bento]")!.innerHTML = projects.map(cardMarkup).join("");

  const cards = projects.map((project) => el.querySelector<HTMLElement>(`#pj-${project.id}`)!);
  const films = cards.map((card) => createFilm(card.querySelector<HTMLElement>("[data-film]")!));

  if (reduceMotion) return;

  // Touch devices keep every film on its static first frame.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const lumen = films[0];
  const inView = films.map(() => false);
  let playing: Film | null = null;

  const rest = (film: Film) => {
    film.pause();
    film.el.classList.remove("is-playing");
    if (film !== lumen) film.seek(0);
    if (playing === film) playing = null;
  };

  const start = (film: Film) => {
    if (playing === film) return;
    if (playing) rest(playing);
    playing = film;
    film.el.classList.add("is-playing");
    film.play();
    document.dispatchEvent(new CustomEvent<HTMLElement>(FILM_PLAY_EVENT, { detail: film.el }));
  };

  const resumeLumen = () => {
    if (!playing && inView[0]) start(lumen);
  };

  document.addEventListener(FILM_PLAY_EVENT, (event) => {
    if (playing && (event as CustomEvent<HTMLElement>).detail !== playing.el) rest(playing);
  });

  cards.forEach((card, index) => {
    const film = films[index];
    const engaged = () => card.matches(":hover, :focus-within");
    const release = () => {
      if (index === 0 || engaged()) return;
      rest(film);
      resumeLumen();
    };

    card.addEventListener("pointerenter", () => inView[index] && start(film));
    card.addEventListener("focusin", () => start(film));
    card.addEventListener("pointerleave", release);
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget as Node | null)) release();
    });

    onVisible(
      card.querySelector(".pj-well")!,
      (visible) => {
        inView[index] = visible;
        if (index === 0) {
          if (visible) {
            if (!playing) start(lumen);
          } else if (playing === lumen) rest(lumen);
          return;
        }
        if (visible && engaged()) start(film);
        if (!visible && playing === film) {
          rest(film);
          resumeLumen();
        }
      },
      index === 0 ? 0.4 : 0.25
    );
  });
}
