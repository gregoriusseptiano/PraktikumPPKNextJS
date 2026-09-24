/**
 * DUITku — Uji integrasi/fungsi lapisan dashboard (SRS P3-16).
 * Jalankan: node --test lib/dashboard/summary.test.ts
 * Tanpa dependensi tambahan, memakai test runner bawaan Node.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  aggregateByCategory,
  buildPieSlices,
  clampRecentLimit,
  computeSummary,
  isOwnedBy,
  isTransactionType,
  isUuid,
  normalizeAmount,
  RECENT_DEFAULT,
} from "./summary.ts";
import {
  currentMonthKey,
  formatBulan,
  formatTanggal,
  isValidMonth,
  monthRange,
  rupiah,
  shiftMonth,
} from "./format.ts";

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

describe("rupiah (DESIGN.md §2.2)", () => {
  it("nominal besar memakai prefiks Rp dan titik ribuan", () => {
    assert.equal(rupiah(1781273), "Rp 1.781.273");
  });

  it("daftar memakai tanda plus spasi tanpa Rp", () => {
    assert.equal(rupiah(75000, { prefix: false, sign: true }), "+ 75.000");
    assert.equal(rupiah(100000, { prefix: false, sign: true }), "+ 100.000");
  });

  it("pengeluaran memakai minus", () => {
    assert.equal(rupiah(100000, { prefix: false, sign: false }).startsWith("-"), false);
    assert.equal(rupiah(-100000, { sign: "auto" }), "- Rp 100.000");
  });
});

describe("formatTanggal dan formatBulan", () => {
  it("tanggal ISO menjadi format Indonesia", () => {
    assert.equal(formatTanggal("2020-01-12"), "12 Januari 2020");
    assert.equal(formatTanggal(""), "-");
  });

  it("kunci bulan menjadi nama bulan", () => {
    assert.equal(formatBulan("2020-01"), "Januari 2020");
    assert.equal(formatBulan("ngawur"), "ngawur");
  });
});

describe("validasi dan rentang bulan (SRS P3-13)", () => {
  it("hanya menerima YYYY-MM yang sah", () => {
    assert.equal(isValidMonth("2020-01"), true);
    assert.equal(isValidMonth("2020-13"), false);
    assert.equal(isValidMonth("2020-1"), false);
    assert.equal(isValidMonth("kemarin"), false);
  });

  it("rentang mencakup awal sampai akhir bulan", () => {
    assert.deepEqual(monthRange("2020-01"), {
      start: "2020-01-01",
      end: "2020-01-31",
    });
    assert.deepEqual(monthRange("2020-02"), {
      start: "2020-02-01",
      end: "2020-02-29",
    });
    assert.deepEqual(monthRange("2021-02"), {
      start: "2021-02-01",
      end: "2021-02-28",
    });
  });

  it("geser bulan melewati batas tahun", () => {
    assert.equal(shiftMonth("2020-01", -1), "2019-12");
    assert.equal(shiftMonth("2020-12", 1), "2021-01");
    assert.equal(currentMonthKey(new Date(2020, 0, 15)), "2020-01");
  });
});

describe("aggregateByCategory (DESIGN.md §3.9)", () => {
  it("mengelompokkan, mengurut menurun, dan pangsa berjumlah 1", () => {
    const result = aggregateByCategory([
      { type: "expense", amount: 100000, category: "Makan" },
      { type: "expense", amount: 50000, category: "Makan" },
      { type: "expense", amount: 75000, category: "Transportasi" },
    ]);
    assert.equal(result.length, 2);
    assert.equal(result[0].category, "Makan");
    assert.equal(result[0].total, 150000);
    const shareSum = result.reduce((a, b) => a + b.share, 0);
    assert.ok(Math.abs(shareSum - 1) < 1e-9);
  });

  it("urutan warna mengikuti urutan nominal dan stabil", () => {
    const a = aggregateByCategory([
      { type: "expense", amount: 10, category: "A" },
      { type: "expense", amount: 30, category: "B" },
      { type: "expense", amount: 20, category: "C" },
    ]);
    assert.deepEqual(
      a.map((x) => x.category),
      ["B", "C", "A"],
    );
    assert.equal(a[0].colorToken, "chart-1");
    assert.equal(a[1].colorToken, "chart-2");
  });

  it("kategori kosong menjadi Lain-lain, baris invalid dilewati", () => {
    const result = aggregateByCategory([
      { type: "expense", amount: 50000, category: "  " },
      { type: "expense", amount: -10, category: "Makan" },
      { type: "expense", amount: 0, category: "Makan" },
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0].category, "Lain-lain");
  });

  it("kosong bila tidak ada nominal valid", () => {
    assert.deepEqual(aggregateByCategory([]), []);
  });
});

describe("buildPieSlices", () => {
  it("sudut mulai dari 0 dan berjumlah 360", () => {
    const items = aggregateByCategory([
      { type: "expense", amount: 150000, category: "Makan" },
      { type: "expense", amount: 50000, category: "Transportasi" },
    ]);
    const slices = buildPieSlices(items);
    assert.equal(slices[0].startAngle, 0);
    const total = slices.reduce((a, s) => a + (s.endAngle - s.startAngle), 0);
    assert.ok(Math.abs(total - 360) < 1e-9);
    assert.ok(slices[1].startAngle >= slices[0].endAngle - 1e-9);
  });
});
