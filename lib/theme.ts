// Preferensi tema via cookie (SRS FR-08/FR-09, P1-11..P1-13; DESIGN §2.1).
// Cookie `theme`: "light" (default) | "dark". Diterapkan ke atribut
// `data-theme` pada <html> dan dibaca ulang saat aplikasi dibuka kembali.

export const THEME_COOKIE = "theme";
export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

export function normalizeTheme(v: unknown): Theme {
  return v === "dark" ? "dark" : "light";
}
