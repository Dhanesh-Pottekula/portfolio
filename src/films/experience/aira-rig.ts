// AiRA's face, built the way the app builds it (aira-client, aira-rig.tsx): her pixel head with the eyes and
// the mouth as separate layers on a 256-cell grid, plus the emotes that float beside her ears.
// Every .ap-face in a film gets the layers; its mood class (aira-app.css) picks which ones show:
//   (none) looking, smiling, blinking   is-talk  mouth moving      is-listen  eyes up, smiling
//   is-think  eyes up-right and a "?"   is-startle  "o" and a "!"  is-happy  happy eyes and a heart
//   is-calm   eyes closed, slow breath

const LAYERS = ["center", "up", "upRight", "closed", "happy", "smile", "open", "o", "flat"];
const EMOTES = ["heart", "bang", "question"];

const img = (name: string, cls: string) => `<img class="${cls}" data-l="${name}" src="films/aira/${name}.svg" alt="">`;

const RIG =
  `<img class="ap-skull" src="films/aira/head.webp" alt="">` +
  LAYERS.map((name) => img(name, "ap-l")).join("") +
  EMOTES.map((name) => img(name, "ap-emote")).join("");

export function rigFaces(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>(".ap-face").forEach((face) => (face.innerHTML = RIG));
}
