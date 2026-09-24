import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { DEFAULT_THEME, THEME_COOKIE, normalizeTheme } from "@/lib/theme";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DUITku: Catat Keuangan Harian",
  description:
    "DUITku, aplikasi pencatat keuangan pribadi berbahasa Indonesia untuk mahasiswa.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // P1-12/P1-13: baca cookie tema, pakai default bila tidak ada (DESIGN §2.1).
  const store = await cookies();
  const theme = normalizeTheme(
    store.get(THEME_COOKIE)?.value ?? DEFAULT_THEME
  );

  return (
    <html lang="id" data-theme={theme} className="h-full">
      <body
        className={`${montserrat.variable} min-h-full font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
