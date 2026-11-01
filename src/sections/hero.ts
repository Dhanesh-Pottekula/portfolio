import "./hero.css";
import html from "./hero.html?raw";
import { icons, LINKS } from "./icons";
import { reduceMotion } from "../engine/loop";

const SKETCH_FALLBACK_MS = 1500;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? "");

export default function mount(el: HTMLElement): void {
  el.innerHTML = fill(html, {
    down: icons.down,
    mail: icons.mail,
    github: LINKS.github,
    linkedin: LINKS.linkedin,
    githubIcon: icons.github,
    linkedinIcon: icons.linkedin,
  });
  // The pencil portrait sketches itself in once the image has loaded (or after a beat, whatever happens first;
  // img.decode() can stall in background tabs, so it isn't used here).
  const sketch = el.querySelector<HTMLElement>("[data-sketch]")!;
  const image = sketch.querySelector("img")!;
  const drawn = () => sketch.classList.add("is-drawn");
  if (reduceMotion || image.complete) drawn();
  else {
    image.addEventListener("load", drawn, { once: true });
    image.addEventListener("error", drawn, { once: true });
    window.setTimeout(drawn, SKETCH_FALLBACK_MS);
  }
}
