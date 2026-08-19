/**
 * Global colour variables.
 *
 * `src/app/globals.css` is the single source of truth — these constants mirror
 * the same `@theme` tokens so JavaScript (GSAP tweens, canvas, inline
 * gradients) can reach for the exact same values Tailwind compiles against.
 */
export const COLORS = {
  /* Brand */
  primary: "#E4C79F",
  primarySoft: "#F3E6D1",
  primaryDeep: "#C3A271",
  primaryDim: "#7D6749",

  /* Surfaces */
  ink: "#080503",
  espresso: "#120B07",
  mocha: "#1D130C",
  cocoa: "#2E1D12",
  bark: "#462C1A",

  /* Content */
  cream: "#F8F1E7",
  sand: "#CDB99D",
  muted: "#8A7255",
} as const;

export type ColorToken = keyof typeof COLORS;

/** `rgb(… / alpha)` helper so JS-authored gradients stay on-palette. */
export function alpha(token: ColorToken, a: number): string {
  const hex = COLORS[token].replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgb(${r} ${g} ${b} / ${a})`;
}
