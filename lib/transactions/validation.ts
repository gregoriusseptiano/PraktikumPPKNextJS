import type { TransactionFieldErrors, TransactionInput } from "./types";

const MAX_AMOUNT = 9_999_999_999.99;
const MAX_CATEGORY_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isTransactionId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export type ParseTransactionResult =
  | { ok: true; data: TransactionInput }
  | { ok: false; fieldErrors: TransactionFieldErrors };

export function parseTransactionForm(
  formData: FormData
): ParseTransactionResult {
  const fieldErrors: TransactionFieldErrors = {};

  const rawType = String(formData.get("type") ?? "");
  const type = rawType === "income" || rawType === "expense" ? rawType : null;

  if (!type) {
    return {
      ok: false,
      fieldErrors: { ...fieldErrors, type: "Pilih jenis transaksi." },
    };
  }

  const rawAmount = String(formData.get("amount") ?? "").trim();
  let amount = 0;

  if (!rawAmount) {
    fieldErrors.amount = "Nominal wajib diisi.";
  } else {
    amount = Number(rawAmount);
    if (!Number.isFinite(amount)) {
      fieldErrors.amount = "Nominal harus berupa angka.";
    } else if (amount <= 0) {
      fieldErrors.amount = "Nominal harus lebih dari 0.";
    } else if (amount > MAX_AMOUNT) {
      fieldErrors.amount = "Nominal terlalu besar.";
    } else {
      amount = Math.round(amount * 100) / 100;
    }
  }

  const category = String(formData.get("category") ?? "").trim();
  if (!category) {
    fieldErrors.category = "Kategori wajib diisi.";
  } else if (category.length > MAX_CATEGORY_LENGTH) {
    fieldErrors.category = `Kategori maksimal ${MAX_CATEGORY_LENGTH} karakter.`;
  }

  const description = String(formData.get("description") ?? "").trim();
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    fieldErrors.description = `Deskripsi maksimal ${MAX_DESCRIPTION_LENGTH} karakter.`;
  }

  const transactionDate = String(
    formData.get("transaction_date") ?? ""
  ).trim();
  if (!transactionDate) {
    fieldErrors.transaction_date = "Tanggal wajib diisi.";
  } else if (!isValidDate(transactionDate)) {
    fieldErrors.transaction_date = "Tanggal tidak valid.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    data: {
      type,
      amount,
      category,
      description,
      transaction_date: transactionDate,
    },
  };
}
