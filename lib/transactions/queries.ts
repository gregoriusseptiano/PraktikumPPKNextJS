import { createClient } from "@/lib/supabase/server";
import type { Transaction, TransactionFilter } from "./types";

export async function listTransactions(
  userId: string,
  filter: TransactionFilter
): Promise<Transaction[]> {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (filter !== "all") {
    query = query.eq("type", filter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listTransactions:", error.message);
    throw new Error("Gagal memuat transaksi.");
  }

  return (data ?? []) as Transaction[];
}

export async function getTransaction(
  userId: string,
  id: string
): Promise<Transaction | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getTransaction:", error.message);
    throw new Error("Gagal memuat transaksi.");
  }

  return (data as Transaction | null) ?? null;
}
