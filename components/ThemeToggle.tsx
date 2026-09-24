"use client";

import { useState, useTransition } from "react";
import { setTheme } from "@/app/actions/theme";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

// Toggle terang/gelap (DESIGN §2.1, SRS P1-11..P1-13).
// Menulis cookie `theme` + atribut data-theme agar langsung terasa
// dan tetap diterapkan saat aplikasi dibuka kembali (SSR via layout).
export default function ThemeToggle() {
  // Baca tema awal dari atribut data-theme yang dipasang SSR (layout).
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light"
  );
  const [, startTransition] = useTransition();

  const next: Theme = theme === "dark" ? "light" : "dark";

  function onToggle() {
    // Terapkan seketika untuk UX, lalu persist via Server Action.
    document.documentElement.setAttribute("data-theme", next);
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setThemeState(next);
    startTransition(() => {
      void setTheme(next);
    });
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[4px] border border-primary px-3 text-[13px] font-medium text-primary transition-colors hover:bg-primary-soft"
    >
      {theme === "dark" ? "Mode terang" : "Mode gelap"}
    </button>
  );
}
