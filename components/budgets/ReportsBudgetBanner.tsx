"use client";

/**
 * DUITku — Pertemuan 5, Programmer 3 (SRS P3-18):
 * `ReportsBudgetBanner` — pulau AJAX di `/reports`.
 *
 * - Fetch PARALEL `GET /api/reports/summary?type=expense&month=` (milik P3
 *   lama, sudah ada) + `GET /api/budgets/summary?month=` (milik P2) tanpa
 *   reload; skeleton + `aria-live` (syarat AJAX Pertemuan 5).
 * - Menampilkan anggaran vs realisasi + warning 80% (waspada) / 100% (over).
 * - Tanpa budget -> CTA "Tetapkan anggaran" (zero-state, acceptance P3).
 * - Semua error generik (SRS P3-20, NFR-04); data user lain tidak pernah
 *   dipakai karena kedua API di-scope `user_id` session (SRS P3-19).
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatBulan, rupiah } from "@/lib/dashboard/format";
import { computeBudgetUsage, type BudgetUsageView } from "@/lib/budgets/status";
import { BudgetError, BudgetWidgetSkeleton } from "./BudgetError";
import {
  BUDGET_UPDATED_EVENT,
  TRANSACTION_UPDATED_EVENT,
} from "./DashboardBudgetWidget";

type BannerState = "loading" | "empty" | "ready" | "error";

export function ReportsBudgetBanner({ month }: { month: string }) {
  const [state, setState] = useState<BannerState>("loading");
  const [view, setView] = useState<BudgetUsageView | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState((s) => (s === "ready" ? s : "loading"));
    try {
      const [budgetRes, reportRes] = await Promise.all([
        fetch(`/api/budgets/summary?month=${encodeURIComponent(month)}`, {
          cache: "no-store",
          signal: ctrl.signal,
        }),
        fetch(
          `/api/reports/summary?type=expense&month=${encodeURIComponent(month)}`,
          { cache: "no-store", signal: ctrl.signal },
        ),
      ]);

      // Budget belum ditetapkan -> zero-state (bukan error).
      if (budgetRes.status === 404) {
        setView(null);
        setState("empty");
        return;
      }
      if (!budgetRes.ok || !reportRes.ok) {
        setState("error");
        return;
      }

      const budgetJson = (await budgetRes.json()) as {
        ok?: boolean;
        data?: { budget?: unknown; amount?: unknown; terpakai?: unknown; spent?: unknown } | null;
      };
      const reportJson = (await reportRes.json()) as {
        ok?: boolean;
        data?: { total?: unknown } | null;
      };

      const raw = budgetJson.data ?? {};
      const budgetAmount =
        (raw as { budget?: unknown; amount?: unknown }).budget ??
        (raw as { amount?: unknown }).amount ??
        null;
      // Realisasi utama dari API budget (milik P2, sudah join expense
      // sebulan); fallback ke total laporan bila bentuk beda.
      const spentRaw =
        (raw as { terpakai?: unknown; spent?: unknown }).terpakai ??
        (raw as { spent?: unknown }).spent ??
        (reportJson.data as { total?: unknown } | undefined)?.total ??
        0;

      const normalized = computeBudgetUsage(budgetAmount, spentRaw);
      if (!budgetJson.ok || normalized === null) {
        setView(null);
        setState("empty");
        return;
      }
      setView(normalized);
      setState("ready");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setState("error");
    }
  }, [month]);

  // Fetch paralel awal (SRS P3-18 Pertemuan 5): sinkronisasi dari API eksternal.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const onMutate = () => {
      void load();
    };
    window.addEventListener(BUDGET_UPDATED_EVENT, onMutate);
    window.addEventListener(TRANSACTION_UPDATED_EVENT, onMutate);
    return () => {
      window.removeEventListener(BUDGET_UPDATED_EVENT, onMutate);
      window.removeEventListener(TRANSACTION_UPDATED_EVENT, onMutate);
      abortRef.current?.abort();
    };
  }, [load]);

  if (state === "loading") {
    return <BudgetWidgetSkeleton label="Memuat pantauan anggaran" />;
  }

  if (state === "error") {
    return <BudgetError title="Gagal memuat pantauan anggaran." onRetry={() => void load()} />;
  }

  if (state === "empty" || !view) {
    return (
      <div className="rounded-xl border border-dashed border-divider bg-surface p-5 shadow-sm text-center">
        <p className="text-sm font-semibold text-ink">
          Belum ada anggaran untuk {formatBulan(month)}
        </p>
        <p className="mt-1 text-xs text-subtle">
          Tetapkan anggaran agar laporan menampilkan peringatan 80% dan 100%.
        </p>
        <Link
          href="/budgets/new"
          className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Tetapkan anggaran
        </Link>
      </div>
    );
  }

  const pct = Math.min(Math.max(view.persen * 100, 0), 100);

  return (
    <section
      aria-label="Anggaran vs realisasi bulan ini"
      aria-live="polite"
      className={`rounded-xl border p-5 shadow-sm ${
        view.status === "over"
          ? "border-expense/40 bg-expense/10"
          : view.status === "waspada"
            ? "border-amber/40 bg-amber/10"
            : "border-divider bg-surface"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-ink">
          Anggaran {formatBulan(month)}: {rupiah(view.terpakai)}{" "}
          <span className="font-medium text-subtle">/ {rupiah(view.budget)}</span>
        </h2>
        <span className="text-xs font-bold text-subtle tabular-nums">
          {Math.round(view.persen * 100)}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Realisasi anggaran ${Math.round(pct)} persen`}
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface"
      >
        <div
          className={`h-full rounded-full ${view.status === "over" ? "bg-expense" : view.status === "waspada" ? "bg-amber" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {view.status === "over" ? (
        <p role="alert" className="mt-2.5 text-xs font-semibold text-expense-deep">
          Overbudget {rupiah(Math.abs(view.sisa))} — pengeluaran {formatBulan(month)} sudah
          melampaui anggaran. Tinjau catatan pengeluaran di bawah.
        </p>
      ) : view.status === "waspada" ? (
        <p className="mt-2.5 text-xs font-semibold text-ink">
          Waspada: sudah {Math.round(view.persen * 100)}% dari anggaran. Sisa{" "}
          {rupiah(view.sisa)}.
        </p>
      ) : (
        <p className="mt-2.5 text-xs text-subtle">
          Aman: sisa {rupiah(view.sisa)} dari anggaran bulan ini.
        </p>
      )}
    </section>
  );
}
