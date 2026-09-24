"use client";

import { useTransition } from "react";
import { logout } from "@/lib/auth/actions";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => void logout())}
      className="inline-flex min-h-[44px] items-center justify-center rounded-[4px] border border-primary px-4 text-[13px] font-semibold text-primary transition-colors hover:bg-primary-soft disabled:opacity-60"
    >
      {pending ? "Keluar..." : "Keluar"}
    </button>
  );
}
