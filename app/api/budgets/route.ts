import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBudgetForm } from "@/lib/budgets/validation";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk melihat anggaran." },
      { status: 401 }
    );
  }

  try {
    const { data: budgets, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", data.user.id)
      .order("month", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ ok: true, data: budgets ?? [] });
  } catch (err) {
    console.error("[api/budgets] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat anggaran. Coba lagi." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk membuat anggaran." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const parsed = parseBudgetForm(formData);

    if (!parsed.ok) {
      return NextResponse.json(
        { ok: false, error: "Data tidak valid.", fieldErrors: parsed.fieldErrors },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("budgets").insert({
      user_id: data.user.id,
      ...parsed.data,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { ok: false, error: "Anggaran untuk bulan ini sudah ada." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[api/budgets] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal menyimpan anggaran. Coba lagi." },
      { status: 500 }
    );
  }
}
