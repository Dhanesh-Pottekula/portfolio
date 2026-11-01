import "./work.css";
import "../films/experience/films.css";
import "../films/experience/aira-app.css";
import "../films/experience/jigsaw.css";
import html from "./work.html?raw";
import airaFilms from "../films/experience/aira.html?raw";
import streetdineFilms from "../films/experience/streetdine.html?raw";
import jigsawFilms from "../films/experience/jigsaw.html?raw";
import { reduceMotion } from "../engine/loop";
import { START as HOLD_START, holdScrollTop } from "../engine/hold";
import { createFilm, type Film } from "../films/player";
import { rigFaces } from "../films/experience/aira-rig";
import { icons } from "./icons";

interface Showcase {
  readonly films: Film[];
  selected: number;
  open: boolean;
  visible: boolean;
}

const FILMS: Record<string, string> = { aira: airaFilms, jigsaw: jigsawFilms, streetdine: streetdineFilms };
const ARROWS: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
const PLAY_RATIO = 0.4;
// The flip turns the phone edge-on at this point, which is when the new topic is swapped in.
const FLIP_SWAP_MS = 290;
// A click scrolls the hold to just inside that row's step.
const STEP_LANDING = 0.12;
// The open row's bottom stays at least this far above the bottom of the screen while the list is pinned.
const VIEW_MARGIN = 28;

// Each row's details (how it's built, and its numbers) open only on the chosen row. The open share moves between rows
// in whole pixels that always add up to the same height (the tallest details), so the list, and the pinned block
// around it, never changes size, even when a fast scroll switches rows faster than they can open. CSS transitions
// can't promise that: an interrupted one reverses on a shortened clock and the total drifts.
// While the list is pinned (held), it also slides up just enough to keep the open row on screen, and whatever
// slides above the list's own top fades out rather than running over the heading.
function rowDetails(list: HTMLElement, pinned: () => boolean): (index: number) => void {
  const details = [...list.querySelectorAll<HTMLElement>(".wk-cap__more")];
  const rows = details.map((el) => el.closest<HTMLElement>(".wk-cap")!);
  const shares = details.map(() => 0);
  let full = 0;
  let target = -1;
  let frame = 0;

  const paint = () => {
    let rest = full;
    details.forEach((el, at) => {
      if (at === target) return;
      const px = Math.round(shares[at] * full);
      el.style.height = `${px}px`;
      rest -= px;
    });
    if (target >= 0) details[target].style.height = `${Math.max(0, rest)}px`;
    keepInView();
  };
  const keepInView = () => {
    const row = rows[target];
    const room = window.innerHeight * (1 - HOLD_START) - VIEW_MARGIN;
    const shift = row && pinned() ? Math.max(0, Math.round(row.offsetTop + row.offsetHeight - room)) : 0;
    list.style.translate = shift ? `0 ${-shift}px` : "";
    list.style.maskImage = shift ? `linear-gradient(transparent ${shift - 8}px, #000 ${shift + 48}px)` : "";
  };
  window.addEventListener("resize", paint);
  const tick = () => {
    let moving = false;
    shares.forEach((share, at) => {
      const goal = at === target ? 1 : 0;
      const next = share + (goal - share) * 0.2;
      shares[at] = Math.abs(goal - next) < 0.003 ? goal : next;
      if (shares[at] !== goal) moving = true;
    });
    paint();
    frame = moving ? requestAnimationFrame(tick) : 0;
  };
  // The tallest details at the list's current width; the wrapping only changes with the width.
  const size = () => {
    full = Math.ceil(Math.max(0, ...details.map((el) => el.scrollHeight)));
    paint();
  };
  let width = 0;
  new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === width) return;
    width = entry.contentRect.width;
    size();
  }).observe(list);
  document.fonts.ready.then(size);

  // The first opening (at mount) lands at once, so the page starts at its final length.
  let placed = false;
  return (index) => {
    target = index;
    if (reduceMotion || !placed) {
      placed = true;
      shares.forEach((_, at) => (shares[at] = at === index ? 1 : 0));
      paint();
    } else if (!frame) frame = requestAnimationFrame(tick);
  };
}

export default function mount(section: HTMLElement): void {
  section.innerHTML = html.replace("{{arrow}}", icons.arrow);

  const narrow = window.matchMedia("(max-width: 819.98px)");
  const devices = new Map<Element, Showcase>();
  const layouts: (() => void)[] = [];
  const onScreen: Showcase[] = [];
  let playing: Film | undefined;

  // The most recently shown or clicked showcase owns the page's single playing film.
  const direct = () => {
    const lead = onScreen.at(-1);
    const next = lead?.films[lead.selected];
    if (next === playing) return;
    playing?.pause();
    playing = next;
    playing?.play();
  };

  // player.ts pauses this film when another section starts one; forget it so the next show or pick plays again.
  document.addEventListener("film:play", (event) => {
    if (playing && (event as CustomEvent<HTMLElement>).detail !== playing.el) playing = undefined;
  });

  const promote = (show: Showcase) => {
    if (!show.visible) return;
    onScreen.splice(onScreen.indexOf(show), 1);
    onScreen.push(show);
  };

  const watcher = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        const show = devices.get(entry.target);
        if (!show) return;
        const visible = entry.isIntersecting && entry.intersectionRatio >= PLAY_RATIO - 0.01;
        if (visible === show.visible) return;
        show.visible = visible;
        if (visible) onScreen.push(show);
        else onScreen.splice(onScreen.indexOf(show), 1);
        direct();
      }),
    { threshold: [0, PLAY_RATIO] },
  );

  const fit = new ResizeObserver((entries) =>
    entries.forEach(({ target, contentRect }) => {
      const canvas = target.firstElementChild as HTMLElement;
      canvas.style.setProperty("--k", (contentRect.width / canvas.offsetWidth).toFixed(4));
    }),
  );

  section.querySelectorAll<HTMLElement>("[data-caps]").forEach((body) => {
    const list = body.querySelector<HTMLElement>(".wk-caps")!;
    const rows = [...list.querySelectorAll<HTMLElement>(".wk-cap")];
    const buttons = rows.map((row) => row.querySelector<HTMLButtonElement>(".wk-cap__btn")!);
    const stage = body.querySelector<HTMLElement>(".wk-stage")!;
    const device = stage.querySelector<HTMLElement>(".wk-device")!;
    const screen = device.querySelector<HTMLElement>(".wk-screen")!;
    const canvas = screen.querySelector<HTMLElement>(".wk-canvas")!;
    const openDetails = rowDetails(list, () => !narrow.matches && !reduceMotion);

    canvas.innerHTML = FILMS[body.dataset.caps ?? ""];
    rigFaces(canvas);
    const show: Showcase = {
      films: [...canvas.querySelectorAll<HTMLElement>("[data-film]")].map((el) => createFilm(el)),
      selected: 0,
      open: true,
      visible: false,
    };

    const layout = () => {
      const mobile = narrow.matches;
      list.setAttribute("role", mobile ? "list" : "tablist");
      if (mobile) list.removeAttribute("aria-orientation");
      else list.setAttribute("aria-orientation", "vertical");
      rows.forEach((row) => (mobile ? row.removeAttribute("role") : row.setAttribute("role", "presentation")));

      openDetails(show.open || !mobile ? show.selected : -1);
      buttons.forEach((button, index) => {
        const chosen = index === show.selected;
        button.classList.toggle("is-on", chosen && (show.open || !mobile));
        if (mobile) {
          button.removeAttribute("role");
          button.removeAttribute("aria-selected");
          button.setAttribute("aria-expanded", String(chosen && show.open));
          button.tabIndex = 0;
        } else {
          button.setAttribute("role", "tab");
          button.setAttribute("aria-selected", String(chosen));
          button.removeAttribute("aria-expanded");
          button.tabIndex = chosen ? 0 : -1;
        }
      });

      device.setAttribute("role", mobile ? "region" : "tabpanel");
      device.setAttribute("aria-labelledby", buttons[show.selected].id);
      if (mobile) device.removeAttribute("tabindex");
      else device.tabIndex = 0;

      const home = mobile ? rows[show.selected] : stage;
      device.hidden = mobile && !show.open;
      if (!device.hidden && device.parentElement !== home) home.append(device);
    };

    const select = (index: number) => {
      show.films[show.selected].el.classList.remove("is-active");
      show.selected = index;
      const film = show.films[index];
      film.el.classList.add("is-active");
      if (!reduceMotion) film.seek(0);
    };

    const choose = (index: number) => {
      if (narrow.matches) {
        // Opening a row below the open one removes the frame above it; keep the tapped row where the finger left it.
        const before = buttons[index].getBoundingClientRect().top;
        show.open = !(show.open && index === show.selected);
        if (index !== show.selected) select(index);
        layout();
        window.scrollBy({ top: buttons[index].getBoundingClientRect().top - before, behavior: "instant" });
      } else {
        if (index !== show.selected) flip(index);
        else layout();
        return;
      }
      promote(show);
      direct();
    };

    // Wide screens: a change of topic turns the phone edge-on, swaps the topic while it can't be seen, and turns it
    // back with a small bounce, as if it opened onto the new screen. Quick successive changes land on the latest one.
    let flipTo = -1;
    let flipTimer = 0;
    const land = (index: number) => {
      select(index);
      layout();
      promote(show);
      direct();
    };
    const flip = (index: number) => {
      buttons.forEach((button, at) => button.classList.toggle("is-on", at === index));
      openDetails(index);
      if (reduceMotion || device.hidden) return land(index);
      flipTo = index;
      if (flipTimer) return;
      device.classList.remove("is-flipping");
      void device.offsetWidth;
      device.classList.add("is-flipping");
      flipTimer = window.setTimeout(() => {
        flipTimer = 0;
        land(flipTo);
      }, FLIP_SWAP_MS);
    };
    device.addEventListener("animationend", (event) => {
      if (event.animationName === "wk-device-flip") device.classList.remove("is-flipping");
    });

    buttons.forEach((button, index) => {
      button.setAttribute("aria-controls", device.id);
      button.addEventListener("click", () => steer(index));
    });

    // Wide screens: while the timeline holds at this list, scrolling steps through the rows one by one
    // (engine/hold.ts), so the phone plays each capability in turn before the page moves on.
    // A click on a wide screen scrolls the hold to that row, so the line draws up to it; the rows passed on the way
    // don't flip the phone.
    let steering = -1;
    let steerTimer = 0;
    const steer = (index: number) => {
      const top = narrow.matches ? null : holdScrollTop(list, (index + STEP_LANDING) / buttons.length);
      if (top === null) return choose(index);
      steering = index;
      choose(index);
      window.scrollTo({ top, behavior: reduceMotion ? "instant" : "smooth" });
      const release = () => {
        window.clearTimeout(steerTimer);
        steering = -1;
      };
      window.clearTimeout(steerTimer);
      steerTimer = window.setTimeout(release, 1200);
      window.addEventListener("scrollend", release, { once: true });
    };

    list.addEventListener("hold:progress", (event) => {
      if (narrow.matches || steering >= 0) return;
      const progress = (event as CustomEvent<number>).detail;
      // Above the hold the list rests on its first row, so it comes back to the reader unshifted.
      const index = progress <= 0 ? 0 : Math.min(buttons.length - 1, Math.floor(progress * buttons.length));
      if (index !== show.selected) choose(index);
    });

    list.addEventListener("keydown", (event) => {
      if (narrow.matches) return;
      const last = buttons.length - 1;
      const step = ARROWS[event.key];
      const next = event.key === "Home" ? 0 : event.key === "End" ? last : step ? (show.selected + step + last + 1) % (last + 1) : -1;
      if (next < 0) return;
      event.preventDefault();
      choose(next);
      buttons[next].focus();
    });

    select(0);
    layout();
    layouts.push(layout);
    devices.set(device, show);
    watcher.observe(device);
    fit.observe(screen);
  });

  narrow.addEventListener("change", () => layouts.forEach((layout) => layout()));
}
