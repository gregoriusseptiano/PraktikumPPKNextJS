import { createClient } from "@/lib/supabase/server";
import type { Budget } from "./types";

export async function listBudgets(userId: string): Promise<Budget[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .order("month", { ascending: false });

  if (error) {
    console.error("listBudgets:", error.message);
    throw new Error("Gagal memuat anggaran.");
  }

  return (data ?? []) as Budget[];
}

export async function getBudget(
  userId: string,
  month: string
): Promise<Budget | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle();

  if (error) {
    console.error("getBudget:", error.message);
    throw new Error("Gagal memuat anggaran.");
  }

  return (data as Budget | null) ?? null;
}
