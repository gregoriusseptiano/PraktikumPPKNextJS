"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "./session";
import type { TransactionActionState, TransactionInput } from "./types";
import { isTransactionId, parseTransactionForm } from "./validation";

export async function createTransactionAction(
  _prevState: TransactionActionState,
  formData: FormData
): Promise<TransactionActionState> {
  const { supabase, user } = await requireUser();
  const parsed = parseTransactionForm(formData);

  if (!parsed.ok) {
    return { fieldErrors: parsed.fieldErrors, formError: null };
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    ...parsed.data,
  });

  if (error) {
    console.error("createTransactionAction:", error.message);
    return {
      fieldErrors: {},
      formError: "Transaksi gagal disimpan. Coba lagi.",
    };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  redirect("/transactions");
}

export async function updateTransactionAction(
  id: string,
  _prevState: TransactionActionState,
  formData: FormData
): Promise<TransactionActionState> {
  const { supabase, user } = await requireUser();

  if (!isTransactionId(id)) {
    return { fieldErrors: {}, formError: "Transaksi tidak ditemukan." };
  }

  const parsed = parseTransactionForm(formData);

  if (!parsed.ok) {
    return { fieldErrors: parsed.fieldErrors, formError: null };
  }

  const changes: TransactionInput = parsed.data;

  const { data, error } = await supabase
    .from("transactions")
    .update(changes)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    console.error("updateTransactionAction:", error.message);
    return {
      fieldErrors: {},
      formError: "Perubahan gagal disimpan. Coba lagi.",
    };
  }

  if (!data || data.length === 0) {
    return {
      fieldErrors: {},
      formError: "Transaksi tidak ditemukan atau bukan milikmu.",
    };
  }

  revalidatePath("/transactions");
  revalidatePath(`/transactions/${id}`);
  revalidatePath("/dashboard");
  redirect(`/transactions/${id}`);
}

export async function deleteTransactionAction(
  id: string,
  _prevState: TransactionActionState,
  _formData: FormData
): Promise<TransactionActionState> {
  const { supabase, user } = await requireUser();

  if (!isTransactionId(id)) {
    return { fieldErrors: {}, formError: "Transaksi tidak ditemukan." };
  }

  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    console.error("deleteTransactionAction:", error.message);
    return {
      fieldErrors: {},
      formError: "Transaksi gagal dihapus. Coba lagi.",
    };
  }

  if (!data || data.length === 0) {
    return {
      fieldErrors: {},
      formError: "Transaksi tidak ditemukan atau bukan milikmu.",
    };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  redirect("/transactions");
}
