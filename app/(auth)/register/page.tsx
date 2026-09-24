"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type AuthResult } from "@/lib/auth/actions";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(
    register,
    {}
  );

  return (
    <div>
      <h1 className="text-[18px] font-bold leading-6 text-ink">Buat akun</h1>
      <p className="mt-1 text-[13px] font-medium leading-[18px] text-sub">
        Satu akun untuk semua catatan keuanganmu.
      </p>

      {state?.error && (
        <p
          role="alert"
          className="mt-4 rounded-[4px] border border-expense px-3 py-2 text-[13px] font-medium text-expense"
        >
          {state.error}
        </p>
      )}
      {state?.info && (
        <p
          role="status"
          className="mt-4 rounded-[4px] border border-income px-3 py-2 text-[13px] font-medium text-income"
        >
          {state.info}{" "}
          <Link href="/login" className="font-semibold underline">
            Masuk
          </Link>
        </p>
      )}

      <form action={action} className="mt-5 flex flex-col gap-4" noValidate>
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-[13px] font-medium leading-[18px] text-ink"
          >
            Nama
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Nama kamu"
            className="min-h-[44px] w-full rounded-[4px] border border-divider bg-surface px-3 text-[14px] text-ink placeholder:text-sub"
          />
          {state?.fieldErrors?.name && (
            <p className="mt-1 text-[13px] font-medium text-expense">
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-[13px] font-medium leading-[18px] text-ink"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nama@kampus.ac.id"
            className="min-h-[44px] w-full rounded-[4px] border border-divider bg-surface px-3 text-[14px] text-ink placeholder:text-sub"
          />
          {state?.fieldErrors?.email && (
            <p className="mt-1 text-[13px] font-medium text-expense">
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-[13px] font-medium leading-[18px] text-ink"
          >
            Sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Minimal 6 karakter"
            className="min-h-[44px] w-full rounded-[4px] border border-divider bg-surface px-3 text-[14px] text-ink placeholder:text-sub"
          />
          {state?.fieldErrors?.password && (
            <p className="mt-1 text-[13px] font-medium text-expense">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex min-h-[44px] w-full items-center justify-center rounded-[4px] bg-primary px-4 text-[14px] font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {pending ? "Mendaftar..." : "Buat akun"}
        </button>
      </form>

      <p className="mt-4 text-center text-[13px] font-medium text-sub">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Masuk
        </Link>
      </p>
    </div>
  );
}
