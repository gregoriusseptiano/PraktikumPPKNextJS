"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---- Validasi (P1-02, P1-06, NFR-03) ----

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthResult = {
  error?: string;
  fieldErrors?: { name?: string; email?: string; password?: string };
  info?: string;
};

function cleanEmail(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim().toLowerCase();
}

// P1-01..P1-04: registrasi. Hashing ditangani Supabase Auth (bcrypt,
// NFR-01) — kita tidak pernah menyimpan/membaca plaintext password.
export async function register(
  _prev: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = cleanEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  const fieldErrors: NonNullable<AuthResult["fieldErrors"]> = {};
  if (!name) fieldErrors.name = "Nama wajib diisi.";
  if (!email) fieldErrors.email = "Email wajib diisi.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "Format email tidak valid.";
  if (!password) fieldErrors.password = "Sandi wajib diisi.";
  else if (password.length < 6)
    fieldErrors.password = "Sandi minimal 6 karakter.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    // P1-03: tolak email yang sudah dipakai tanpa membocorkan hash/secret.
    if (/already registered|already exists|duplicate/i.test(error.message)) {
      return { error: "Email sudah terdaftar. Silakan masuk." };
    }
    return { error: "Pendaftaran gagal. Coba lagi." };
  }

  // Supabase tidak error tapi user sudah ada (identities kosong).
  if (data.user && data.user.identities?.length === 0) {
    return { error: "Email sudah terdaftar. Silakan masuk." };
  }

  // P1-08: session dibuat otomatis bila konfirmasi email nonaktif.
  if (data.session) redirect("/dashboard");

  // Konfirmasi email aktif: tidak ada session, minta verifikasi dulu.
  return {
    info: "Akun dibuat. Cek email untuk verifikasi, lalu masuk.",
  };
}

// P1-05/P1-06: login. Error selalu generik (P1-14, DESIGN §4.1).
export async function login(
  _prev: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = cleanEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  const fieldErrors: NonNullable<AuthResult["fieldErrors"]> = {};
  if (!email) fieldErrors.email = "Email wajib diisi.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "Format email tidak valid.";
  if (!password) fieldErrors.password = "Sandi wajib diisi.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // P1-14: pesan generik agar tidak membocorkan akun terdaftar.
  if (error) return { error: "Email atau sandi salah." };

  redirect("/dashboard");
}

// P1-07: logout, akhiri session (FR-07).
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
