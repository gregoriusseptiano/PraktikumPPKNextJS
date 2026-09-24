"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthResult } from "@/lib/auth/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(
    login,
    {}
  );

  return (
    <div>
      <h1 className="text-[18px] font-bold leading-6 text-ink">Masuk</h1>
      <p className="mt-1 text-[13px] font-medium leading-[18px] text-sub">
        Catat pemasukan dan pengeluaran harianmu.
      </p>

      {state?.error && (
        <p
          role="alert"
          className="mt-4 rounded-[4px] border border-expense px-3 py-2 text-[13px] font-medium text-expense"
        >
          {state.error}
        </p>
      )}

      <form action={action} className="mt-5 flex flex-col gap-4" noValidate>
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
            autoComplete="current-password"
            required
            placeholder="••••••••"
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
          {pending ? "Memeriksa..." : "Masuk"}
        </button>
      </form>

      <p className="mt-4 text-center text-[13px] font-medium text-sub">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Buat akun
        </Link>
      </p>
    </div>
  );
}
