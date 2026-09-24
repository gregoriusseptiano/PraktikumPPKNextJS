import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

// Placeholder route privat untuk Programmer 1 (P1-09: bukti guard bekerja).
// Dashboard penuh (saldo, ringkasan, transaksi terbaru) adalah tugas
// Programmer 3 — file ini boleh diganti saat Modul E dikerjakan.
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Kamu";
  const initial = name.charAt(0).toUpperCase() || "D";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header biru (motif DESIGN §3.1) */}
      <header className="bg-primary px-5 pb-10 pt-5 text-white">
        <div className="mx-auto flex w-full max-w-[480px] items-center justify-between">
          <div>
            <p className="text-[13px] font-medium">Hi {name}</p>
            <p className="mt-0.5 text-[11px]">Uang kamu tersisa</p>
            <p className="tnum mt-1 text-[20px] font-bold leading-7">
              Rp 0
            </p>
          </div>
          <span
            aria-hidden
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/20 text-[20px] font-bold"
          >
            {initial}
          </span>
        </div>
      </header>

      {/* Sheet putih (DESIGN §3.1) */}
      <main className="mx-auto w-full max-w-[480px] flex-1 rounded-t-[32px] bg-surface px-5 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-semibold text-ink">Dashboard</h1>
          <ThemeToggle />
        </div>
        <p className="mt-2 text-[13px] font-medium text-sub">
          Masuk sebagai {user.email}
        </p>
        <p className="mt-3 rounded-[6px] bg-background p-3 text-[13px] text-sub">
          Ringkasan saldo dan transaksi terbaru akan dibangun di Modul E
          (Programmer 3). Session login kamu sudah aktif.
        </p>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
