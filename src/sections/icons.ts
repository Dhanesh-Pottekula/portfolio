const stroke = (body: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const icons = {
  github: `<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`,
  linkedin: stroke(`<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10.5V16M8 7.6v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V16"/>`),
  leetcode: stroke(`<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>`),
  mail: stroke(`<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>`),
  down: stroke(`<path d="M12 5v14M6 13l6 6 6-6"/>`),
  close: stroke(`<path d="M6 6l12 12M18 6L6 18"/>`),
  arrow: stroke(`<path d="M7 17L17 7M9 7h8v8"/>`),
};

export const LINKS = {
  email: "dhaneshpk359@gmail.com",
  github: "https://github.com/Dhanesh-Pottekula",
  linkedin: "https://www.linkedin.com/in/dhanesh-pottekula-a40900230/",
  leetcode: "https://leetcode.com/u/Dhanesh_Pottekula/",
};
