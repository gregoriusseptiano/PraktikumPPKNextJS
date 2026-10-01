/**
 * DUITku — Pertemuan 5, Programmer 3: Integration & Test (SRS P3-21).
 * Jalankan: node --test lib/budgets/usage.test.ts
 * Tanpa dependensi tambahan, memakai test runner bawaan Node.
 *
 * Cakupan P3 (jangan lebih, jangan kurang):
 * - Status turunan aman/waspada/over dari `lib/budgets/status.ts`
 *   (rumus SRS §13.2: terpakai/budget, sisa = budget - terpakai).
 * - Isolasi `isBudgetOwnedBy()` dari `lib/budgets/ownership.ts` sebagai
 *   RLS NEGATIVE test di lapisan aplikasi: User A tidak boleh cocok
 *   dengan baris User B (simulasi `auth.uid() = user_id`).
 * - Simulasi alur E2E murni: buat budget -> catat expense -> widget
 *   berubah -> warning overbudget -> hapus (tanpa DB/jaringan).
 *
 * Yang BUKAN milik P3 dan tidak diuji di sini:
 * - P1: migrasi `supabase/budgets.sql`, RLS policies, validasi
 *   `isValidMonth`/amount, Server Actions + `POST/PUT/DELETE /api/budgets`.
 * - P2: `getBudgetUsage()` (join budgets + SUM expense sebulan) dan
 *   `GET /api/budgets/summary` + AJAX filter/CRUD transaksi.
 * Verifikasi RLS di database dilakukan manual (lihat komentar di bawah)
 * setelah P1 merge; test ini memastikan lapisan aplikasi tidak bocor
 * bila query lupa memfilter.
 *
 * RLS manual (Supabase SQL Editor, sebagai user login):
 *   select * from public.budgets; -- hanya baris sendiri
 *   -- login sebagai User A, coba baca budget User B via id/month langsung:
 *   select * from public.budgets where month = '<bulan-milik-B>';
 *   -- expect: 0 baris (policy *_own menolak).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeBudgetUsage,
  getBudgetStatus,
} from "./status.ts";
import { isBudgetOwnedBy } from "./ownership.ts";

describe("getBudgetStatus (SRS §13.2: aman <80% | waspada 80-99% | over >=100%)", () => {
  it("aman di bawah 80%", () => {
    assert.equal(getBudgetStatus(0), "aman");
    assert.equal(getBudgetStatus(0.5), "aman");
    assert.equal(getBudgetStatus(0.799), "aman");
  });

  it("waspada pada 80% sampai di bawah 100%", () => {
    assert.equal(getBudgetStatus(0.8), "waspada");
    assert.equal(getBudgetStatus(0.95), "waspada");
    assert.equal(getBudgetStatus(0.999), "waspada");
  });

  it("over pada 100% ke atas", () => {
    assert.equal(getBudgetStatus(1), "over");
    assert.equal(getBudgetStatus(1.5), "over");
  });

  it("input invalid tidak merusak UI (aman)", () => {
    assert.equal(getBudgetStatus(undefined), "aman");
    assert.equal(getBudgetStatus(Number.NaN), "aman");
    assert.equal(getBudgetStatus("bukan-angka"), "aman");
  });
});

describe("computeBudgetUsage (FR-24: budget + progress)", () => {
  it("menghitung sisa dan persen", () => {
    const view = computeBudgetUsage(1_000_000, 300_000);
    assert.deepEqual(view, {
      budget: 1_000_000,
      terpakai: 300_000,
      sisa: 700_000,
      persen: 0.3,
      status: "aman",
    });
  });

  it("tanpa budget -> null (widget tampil CTA, acceptance P3)", () => {
    assert.equal(computeBudgetUsage(null, 100_000), null);
    assert.equal(computeBudgetUsage(0, 0), null);
    assert.equal(computeBudgetUsage(-500, 0), null);
    assert.equal(computeBudgetUsage("", 0), null);
  });

  it("user tanpa transaksi: terpakai 0, sisa = budget, 0% (P3-06 analog)", () => {
    const view = computeBudgetUsage(500_000, 0);
    assert.equal(view?.terpakai, 0);
    assert.equal(view?.sisa, 500_000);
    assert.equal(view?.persen, 0);
    assert.equal(view?.status, "aman");
  });

  it("overbudget: sisa negatif dan status over", () => {
    const view = computeBudgetUsage(500_000, 650_000);
    assert.equal(view?.sisa, -150_000);
    assert.equal(view?.status, "over");
  });

  it("menerima string numerik dari kolom numeric Postgres", () => {
    const view = computeBudgetUsage("1000000.00", "800000.50");
    assert.equal(view?.budget, 1_000_000);
    assert.equal(view?.terpakai, 800_000.5);
    assert.equal(view?.status, "waspada");
  });
});

describe("isBudgetOwnedBy — RLS negative di lapisan aplikasi (SRS P3-19, FR-28)", () => {
  it("true hanya bila ID sama persis", () => {
    assert.equal(isBudgetOwnedBy("user-a", "user-a"), true);
  });

  it("User A tidak cocok dengan baris User B (tidak bocor)", () => {
    assert.equal(isBudgetOwnedBy("user-b", "user-a"), false);
    assert.equal(isBudgetOwnedBy("user-a", "user-b"), false);
  });

  it("false untuk ID kosong atau bukan string", () => {
    assert.equal(isBudgetOwnedBy("", "user-a"), false);
    assert.equal(isBudgetOwnedBy("user-a", ""), false);
    assert.equal(isBudgetOwnedBy(null, "user-a"), false);
    assert.equal(isBudgetOwnedBy(123, "123"), false);
  });
});

describe("E2E murni: budget -> expense -> warning -> hapus (SRS P3-21)", () => {
  it("widget berubah mengikuti mutasi tanpa reload (simulasi event)", () => {
    // 1. Register/login dilewati (milik P1); user sudah pegang session user-a.
    const userId = "user-a";
    assert.equal(isBudgetOwnedBy("user-a", userId), true);

    // 2. Buat budget 1jt (tulis milik P1; di sini hanya angka jadi).
    let view = computeBudgetUsage(1_000_000, 0);
    assert.equal(view?.status, "aman");

    // 3. Catat expense 500rb (tulis milik P2) -> widget berubah.
    view = computeBudgetUsage(1_000_000, 500_000);
    assert.equal(view?.persen, 0.5);
    assert.equal(view?.status, "aman");

    // 4. Catat lagi 400rb -> 90% -> waspada.
    view = computeBudgetUsage(1_000_000, 900_000);
    assert.equal(view?.status, "waspada");

    // 5. Catat lagi 200rb -> 110% -> over + warning.
    view = computeBudgetUsage(1_000_000, 1_100_000);
    assert.equal(view?.status, "over");
    assert.equal(view?.sisa, -100_000);

    // 6. Hapus budget -> kembali zero-state CTA.
    view = computeBudgetUsage(null, 0);
    assert.equal(view, null);

    // 7. Data user lain tidak memengaruhi widget user aktif.
    assert.equal(isBudgetOwnedBy("user-b-budget", userId), false);
  });
});
