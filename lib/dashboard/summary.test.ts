/**
 * DUITku — Uji integrasi/fungsi lapisan dashboard (SRS P3-16).
 * Jalankan: node --test lib/dashboard/summary.test.ts
 * Tanpa dependensi tambahan, memakai test runner bawaan Node.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  clampRecentLimit,
  computeSummary,
  isOwnedBy,
  isTransactionType,
  isUuid,
  normalizeAmount,
  RECENT_DEFAULT,
} from "./summary.ts";

describe("computeSummary (SRS P3-02..P3-04)", () => {
  it("menjumlahkan income dan expense lalu saldo = income - expense", () => {
    const result = computeSummary([
      { type: "income", amount: 500000 },
      { type: "income", amount: 250000 },
      { type: "expense", amount: 100000 },
    ]);
    assert.equal(result.totalIncome, 750000);
    assert.equal(result.totalExpense, 100000);
    assert.equal(result.balance, 650000);
  });

  it("user tanpa transaksi mendapat 0, 0, 0 (SRS P3-06)", () => {
    assert.deepEqual(computeSummary([]), {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    });
  });

  it("saldo boleh negatif bila pengeluaran lebih besar", () => {
    const result = computeSummary([{ type: "expense", amount: 50000 }]);
    assert.equal(result.balance, -50000);
  });

  it("melewati baris bertipe invalid (SRS P3-13)", () => {
    const result = computeSummary([
      { type: "income", amount: 100000 },
      { type: "transfer", amount: 999999 },
      { type: null, amount: 999999 },
    ]);
    assert.equal(result.totalIncome, 100000);
    assert.equal(result.totalExpense, 0);
  });

  it("melewati nominal nol, negatif, NaN, Infinity (SRS P2-03)", () => {
    const result = computeSummary([
      { type: "income", amount: 100000 },
      { type: "income", amount: 0 },
      { type: "income", amount: -5000 },
      { type: "expense", amount: Number.NaN },
      { type: "expense", amount: Infinity },
      { type: "expense", amount: "bukan-angka" },
    ]);
    assert.deepEqual(result, {
      totalIncome: 100000,
      totalExpense: 0,
      balance: 100000,
    });
  });

  it("menerima nominal string numerik dari kolom numeric Postgres", () => {
    const result = computeSummary([
      { type: "income", amount: "150000.50" },
      { type: "expense", amount: "50000.25" },
    ]);
    assert.equal(result.totalIncome, 150000.5);
    assert.equal(result.totalExpense, 50000.25);
    assert.equal(result.balance, 100000.25);
  });
});

describe("normalizeAmount (SRS P3-13)", () => {
  it("menolak non-angka dan nilai <= 0", () => {
    assert.equal(normalizeAmount(0), null);
    assert.equal(normalizeAmount(-1), null);
    assert.equal(normalizeAmount(""), null);
    assert.equal(normalizeAmount(" Semangat "), null);
    assert.equal(normalizeAmount(undefined), null);
  });

  it("menerima angka dan string numerik positif", () => {
    assert.equal(normalizeAmount(2500), 2500);
    assert.equal(normalizeAmount("2500.75"), 2500.75);
  });
});

describe("isTransactionType", () => {
  it("hanya menerima income dan expense", () => {
    assert.equal(isTransactionType("income"), true);
    assert.equal(isTransactionType("expense"), true);
    assert.equal(isTransactionType("Income"), false);
    assert.equal(isTransactionType(""), false);
  });
});

describe("clampRecentLimit (SRS P3-05, P3-13)", () => {
  it("default 5 untuk input bukan angka", () => {
    assert.equal(clampRecentLimit(undefined), RECENT_DEFAULT);
    assert.equal(clampRecentLimit("semua"), RECENT_DEFAULT);
    assert.equal(clampRecentLimit(Number.NaN), RECENT_DEFAULT);
  });

  it("menjepit ke rentang 1..20", () => {
    assert.equal(clampRecentLimit(0), 1);
    assert.equal(clampRecentLimit(-3), 1);
    assert.equal(clampRecentLimit(100), 20);
    assert.equal(clampRecentLimit(7), 7);
    assert.equal(clampRecentLimit("3"), 3);
  });
});

describe("isOwnedBy (SRS P3-09..P3-11)", () => {
  it("true hanya bila userId sama persis", () => {
    assert.equal(isOwnedBy("user-a", "user-a"), true);
    assert.equal(isOwnedBy("user-a", "user-b"), false);
  });

  it("false untuk nilai kosong atau bukan string", () => {
    assert.equal(isOwnedBy("", "user-a"), false);
    assert.equal(isOwnedBy("user-a", ""), false);
    assert.equal(isOwnedBy(null, "user-a"), false);
    assert.equal(isOwnedBy(123, "123"), false);
  });
});

describe("isUuid (SRS P3-13)", () => {
  it("menerima UUID dan menolak selain itu", () => {
    assert.equal(isUuid("550e8400-e29b-41d4-a716-446655440000"), true);
    assert.equal(isUuid("bukan-uuid"), false);
    assert.equal(isUuid(""), false);
    assert.equal(isUuid(null), false);
  });
});
