"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE, normalizeTheme, type Theme } from "@/lib/theme";

// P1-11: simpan preferensi tema ke cookie (SRS FR-08).
export async function setTheme(theme: Theme): Promise<void> {
  const value = normalizeTheme(theme);
  const store = await cookies();
  store.set(THEME_COOKIE, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
    sameSite: "lax",
  });
}
