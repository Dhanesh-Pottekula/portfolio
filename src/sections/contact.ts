import "./contact.css";
import { icons, LINKS } from "./icons";

const RESET_MS = 2200;

const html = `
<dialog class="ct" aria-labelledby="ct-title">
  <div class="ct__inner">
    <figure class="ct__art" aria-hidden="true"><img src="img/pencil/rooftop.webp" width="1460" height="812" alt="" loading="lazy" decoding="async"></figure>
    <div class="ct__copy">
      <p class="kicker">contact</p>
      <h2 class="ct__name" id="ct-title">Dhanesh Pottekula</h2>
      <p class="ct__line serif">Have a hard problem? <em>Let's talk.</em></p>
      <div class="pills ct__pills">
        <button class="pill pill--signal" type="button" data-copy="${LINKS.email}">${icons.mail}<span data-copy-text>${LINKS.email}</span><span class="ct__state" data-copy-state>copy</span></button>
        <a class="pill" href="mailto:${LINKS.email}">${icons.arrow}write an email</a>
        <a class="pill" href="${LINKS.github}" target="_blank" rel="noopener">${icons.github}github</a>
        <a class="pill" href="${LINKS.linkedin}" target="_blank" rel="noopener">${icons.linkedin}linkedin</a>
        <a class="pill" href="${LINKS.leetcode}" target="_blank" rel="noopener">${icons.leetcode}leetcode</a>
      </div>
    </div>
    <button class="ct__close" type="button" data-close aria-label="Close">${icons.close}</button>
  </div>
</dialog>`;

function selectText(node: Node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

// Some embedded viewers can't follow mailto:, so the primary action copies the address.
export function copyOnClick(button: HTMLButtonElement) {
  const state = button.querySelector<HTMLElement>("[data-copy-state]");
  const text = button.querySelector<HTMLElement>("[data-copy-text]");
  let timer = 0;
  button.addEventListener("click", () => {
    const show = (label: string) => {
      if (!state) return;
      state.textContent = label;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => (state.textContent = "copy"), RESET_MS);
    };
    const fallback = () => {
      if (text) selectText(text);
      show("selected");
    };
    if (!navigator.clipboard) return fallback();
    navigator.clipboard.writeText(button.dataset.copy ?? "").then(() => show("copied ✓"), fallback);
  });
}

export default function mount(el: HTMLElement): void {
  el.innerHTML = html;
  const dialog = el.querySelector<HTMLDialogElement>("dialog")!;
  let opener: HTMLElement | null = null;

  document.addEventListener("click", (event) => {
    const trigger = (event.target as Element).closest<HTMLElement>("[data-contact]");
    if (!trigger) return;
    opener = trigger;
    dialog.showModal();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || (event.target as Element).closest("[data-close]")) dialog.close();
  });
  dialog.addEventListener("close", () => opener?.focus({ preventScroll: true }));
  dialog.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach(copyOnClick);
}
