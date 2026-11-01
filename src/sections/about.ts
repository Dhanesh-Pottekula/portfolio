import "./about.css";
import html from "./about.html?raw";
import { icons, LINKS } from "./icons";
import { copyOnClick } from "./contact";

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? "");

export default function mount(el: HTMLElement): void {
  el.innerHTML = fill(html, {
    email: LINKS.email,
    github: LINKS.github,
    linkedin: LINKS.linkedin,
    leetcode: LINKS.leetcode,
    mail: icons.mail,
    githubIcon: icons.github,
    linkedinIcon: icons.linkedin,
    leetcodeIcon: icons.leetcode,
  });
  el.querySelector("[data-year]")!.textContent = String(new Date().getFullYear());
  el.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach(copyOnClick);
}
