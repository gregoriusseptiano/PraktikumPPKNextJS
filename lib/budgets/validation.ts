import type { BudgetFieldErrors, BudgetInput } from "./types";

const MAX_AMOUNT = 9_999_999_999.99;
const MONTH_PATTERN = /^[0-9]{4}-(0[1-9]|1[0-2])$/;

export function isValidMonth(value: string): boolean {
  return MONTH_PATTERN.test(value);
}

export function parseBudgetForm(formData: FormData):
  | { ok: true; data: BudgetInput }
  | { ok: false; fieldErrors: BudgetFieldErrors } {
  const fieldErrors: BudgetFieldErrors = {};

  const month = String(formData.get("month") ?? "").trim();
  if (!month) {
    fieldErrors.month = "Bulan wajib diisi.";
  } else if (!isValidMonth(month)) {
    fieldErrors.month = "Format bulan tidak valid (YYYY-MM).";
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

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, data: { month, amount } };
}
