"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BudgetActionState, BudgetInput } from "./types";
import { parseBudgetForm } from "./validation";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function createBudgetAction(
  _prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  const { supabase, user } = await requireUser();
  const parsed = parseBudgetForm(formData);

  if (!parsed.ok) {
    return { fieldErrors: parsed.fieldErrors, formError: null };
  }

  const { error } = await supabase.from("budgets").insert({
    user_id: user.id,
    ...parsed.data,
  });

  if (error) {
    console.error("createBudgetAction:", error.message);
    if (error.code === "23505") {
      return {
        fieldErrors: {},
        formError: "Anggaran untuk bulan ini sudah ada.",
      };
    }
    return {
      fieldErrors: {},
      formError: "Anggaran gagal disimpan. Coba lagi.",
    };
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
  redirect("/budgets");
}

export async function updateBudgetAction(
  month: string,
  _prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  const { supabase, user } = await requireUser();
  const parsed = parseBudgetForm(formData);

  if (!parsed.ok) {
    return { fieldErrors: parsed.fieldErrors, formError: null };
  }

  const changes: BudgetInput = parsed.data;

  const { data, error } = await supabase
    .from("budgets")
    .update(changes)
    .eq("user_id", user.id)
    .eq("month", month)
    .select("id");

  if (error) {
    console.error("updateBudgetAction:", error.message);
    return {
      fieldErrors: {},
      formError: "Perubahan gagal disimpan. Coba lagi.",
    };
  }

  if (!data || data.length === 0) {
    return {
      fieldErrors: {},
      formError: "Anggaran tidak ditemukan atau bukan milikmu.",
    };
  }

  revalidatePath("/budgets");
  revalidatePath(`/budgets/${month}`);
  revalidatePath("/dashboard");
  revalidatePath("/reports");
  redirect("/budgets");
}

export async function deleteBudgetAction(
  month: string,
  _prevState: BudgetActionState,
  _formData: FormData
): Promise<BudgetActionState> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("budgets")
    .delete()
    .eq("user_id", user.id)
    .eq("month", month)
    .select("id");

  if (error) {
    console.error("deleteBudgetAction:", error.message);
    return {
      fieldErrors: {},
      formError: "Anggaran gagal dihapus. Coba lagi.",
    };
  }

  if (!data || data.length === 0) {
    return {
      fieldErrors: {},
      formError: "Anggaran tidak ditemukan atau bukan milikmu.",
    };
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
  redirect("/budgets");
}
