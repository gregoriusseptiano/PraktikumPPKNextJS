import { redirect } from "next/navigation";

/**
 * Jahitan integrasi alur SRS §10 (Programmer 3, P3-15):
 * pengguna dibuka ke /dashboard; tanpa session valid, DAL dashboard
 * redirect ke /login (halaman auth milik Programmer 1).
 */
export default function Home() {
  redirect("/dashboard");
}
