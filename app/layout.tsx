import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

/* Montserrat sesuai DESIGN.md §2.2 dan §9 (bentuk angka jelas untuk
 * nominal uang). Atribut data-theme (light/dark) dikendalikan cookie
 * theme milik Programmer 1; default terang (SRS P1-13). */
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DUITku",
  description: "Aplikasi pencatat keuangan pribadi untuk mahasiswa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
