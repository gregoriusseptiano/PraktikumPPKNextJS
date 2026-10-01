"use client";

/**
 * DUITku — Pertemuan 5, Programmer 3 (SRS P3-17):
 * `DashboardBudgetWidget` — pulau AJAX di `/dashboard`.
 *
 * - Client `fetch(/api/budgets/summary?month=)` milik P2, tanpa reload.
 * - Skeleton saat loading, zero-state CTA "Tetapkan anggaran" (acceptance P3),
 *   error generik tanpa bocor detail (SRS P3-20, NFR-04).
 * - Auto-refresh tiap mutasi: dengar custom event `budget:updated` dan
 *   `transaction:updated` (diemit P1/P2 saat CRUD sukses) + polling 30 dtk
 *   sebagai jaring pengaman. Hanya MENDENGAR, tidak mengemit (milik P1/P2).
 * - Status aman <80% | waspada 80-99% | over >=100% (SRS §13.2).
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { rupiah } from "@/lib/dashboard/format";
import { computeBudgetUsage, type BudgetUsageView } from "@/lib/budgets/status";
import { BudgetError, BudgetWidgetSkeleton } from "./BudgetError";

type WidgetState = "loading" | "empty" | "ready" | "error";

/** Event yang didengar widget (diemit oleh CRUD milik P1/P2). */
export const BUDGET_UPDATED_EVENT = "budget:updated";
export const TRANSACTION_UPDATED_EVENT = "transaction:updated";

const POLL_MS = 30_000;

interface SummaryResponse {
  ok?: boolean;
  data?: {
    budget?: unknown;
    terpakai?: unknown;
    sisa?: unknown;
    persen?: unknown;
    status?: unknown;
  } | null;
}

function normalizeView(payload: SummaryResponse["data"]): BudgetUsageView | null {
  if (!payload || typeof payload !== "object") return null;
  // P2 mengembalikan {budget, terpakai, sisa, persen, status}; turunkan
  // ulang sisa/persen/status dari budget+terpakai agar konsisten dengan
  // rumus SRS meski API berubah bentuk.
  const raw = payload as { budget?: unknown; amount?: unknown; terpakai?: unknown; spent?: unknown };
  const budgetAmount = raw.budget ?? raw.amount ?? null;
  const spent = raw.terpakai ?? raw.spent ?? 0;
  if (budgetAmount === null || budgetAmount === undefined) return null;
  return computeBudgetUsage(budgetAmount, spent);
}

export function DashboardBudgetWidget({ month }: { month: string }) {
  const [state, setState] = useState<WidgetState>("loading");
  const [view, setView] = useState<BudgetUsageView | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState((s) => (s === "ready" ? s : "loading"));
    try {
      const res = await fetch(
        `/api/budgets/summary?month=${encodeURIComponent(month)}`,
        { cache: "no-store", signal: ctrl.signal },
      );
      if (!res.ok) {
        // 404 = belum ada budget bulan ini -> zero-state CTA (bukan error).
        // 401/403/500 -> pesan generik (P3-20).
        if (res.status === 404) {
          setView(null);
          setState("empty");
          return;
        }
        setState("error");
        return;
      }
      const json = (await res.json()) as SummaryResponse;
      const normalized = normalizeView(json.data);
      if (!json.ok || normalized === null) {
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

  // AJAX awal + langganan mutasi + polling 30 dtk (SRS P3-17 Pertemuan 5).
  // Fetch awal sinkronisasi state dari API eksternal, bukan cascading render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const onMutate = () => {
      void load();
    };
    window.addEventListener(BUDGET_UPDATED_EVENT, onMutate);
    window.addEventListener(TRANSACTION_UPDATED_EVENT, onMutate);
    const timer = window.setInterval(() => {
      void load();
    }, POLL_MS);
    return () => {
      window.removeEventListener(BUDGET_UPDATED_EVENT, onMutate);
      window.removeEventListener(TRANSACTION_UPDATED_EVENT, onMutate);
      window.clearInterval(timer);
      abortRef.current?.abort();
    };
  }, [load]);

  if (state === "loading") {
    return <BudgetWidgetSkeleton label="Memuat anggaran bulan ini" />;
  }

  if (state === "error") {
    return (
      <div className="rounded-xl border border-divider bg-surface p-5 shadow-sm">
        <BudgetError title="Gagal memuat anggaran." onRetry={() => void load()} />
      </div>
    );
  }

  if (state === "empty" || !view) {
    return (
      <div className="rounded-xl border border-dashed border-divider bg-surface p-5 shadow-sm text-center">
        <p className="text-sm font-semibold text-ink">Belum ada anggaran bulan ini</p>
        <p className="mt-1 text-xs text-subtle">
          Tetapkan anggaran agar realisasi pengeluaran terpantau otomatis.
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
  const barColor =
    view.status === "over"
      ? "bg-expense"
      : view.status === "waspada"
        ? "bg-amber"
        : "bg-primary";
  const statusLabel =
    view.status === "over"
      ? "Overbudget"
      : view.status === "waspada"
        ? "Waspada"
        : "Aman";

  return (
    <section
      aria-label="Pantauan anggaran bulan ini"
      aria-live="polite"
      className="rounded-xl border border-divider bg-surface p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-ink">Anggaran Bulan Ini</h2>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            view.status === "over"
              ? "bg-expense/10 text-expense-deep"
              : view.status === "waspada"
                ? "bg-amber/15 text-ink"
                : "bg-primary-soft text-primary"
          }`}
        >
          {statusLabel} · {Math.round(view.persen * 100)}%
        </span>
      </div>

      <p className="mt-3 text-2xl font-extrabold text-ink tabular-nums">
        {rupiah(view.terpakai)}
        <span className="text-sm font-medium text-subtle">
          {" "}
          / {rupiah(view.budget)}
        </span>
      </p>

      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Realisasi anggaran ${Math.round(pct)} persen`}
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs">
        <span className="text-subtle">
          {view.status === "over"
            ? `Over ${rupiah(Math.abs(view.sisa))}`
            : `Sisa ${rupiah(view.sisa)}`}
        </span>
        <Link
          href="/budgets"
          className="font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Kelola anggaran
        </Link>
      </div>

      {view.status === "over" ? (
        <p role="alert" className="mt-3 rounded-lg border border-expense/30 bg-expense/10 px-3 py-2 text-xs font-semibold text-expense-deep">
          Pengeluaran sudah mencapai {Math.round(view.persen * 100)}% dari anggaran. Kurangi pengeluaran atau sesuaikan anggaran.
        </p>
      ) : view.status === "waspada" ? (
        <p className="mt-3 rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-xs font-semibold text-ink">
          Sudah {Math.round(view.persen * 100)}% dari anggaran. Jaga pengeluaran agar tidak overbudget.
        </p>
      ) : null}
    </section>
  );
}
