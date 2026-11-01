import "./styles/tokens.css";
import "./styles/base.css";
import { start } from "./engine/loop";
import initEffects from "./engine/effects";
import initPop from "./engine/pop";
import initTurns from "./engine/turn";
import initBraids from "./engine/braid";
import initHolds from "./engine/hold";
import "./styles/pop.css";
import mountHero from "./sections/hero";
import mountWork from "./sections/work";
import mountProjects from "./sections/projects";
import mountAbout from "./sections/about";
import mountContact from "./sections/contact";

const mounts: Record<string, (el: HTMLElement) => void> = {
  hero: mountHero,
  work: mountWork,
  projects: mountProjects,
  about: mountAbout,
  contact: mountContact,
};

document.querySelectorAll<HTMLElement>("[data-mount]").forEach((el) => mounts[el.dataset.mount ?? ""]?.(el));
initPop();
initTurns();
initHolds();
initBraids();
initEffects();
start();

// Sections are mounted by script, so the browser's own jump to a #hash lands before the page has its height.
const target = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
if (target) {
  const land = () => target.scrollIntoView({ behavior: "instant" });
  window.addEventListener("load", () => {
    land();
    document.fonts?.ready.then(() => window.setTimeout(land, 150));
  }, { once: true });
}
