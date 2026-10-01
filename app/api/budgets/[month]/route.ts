import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidMonth, parseBudgetForm } from "@/lib/budgets/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ month: string }> }
) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk melihat anggaran." },
      { status: 401 }
    );
  }

  const { month } = await params;

  if (!isValidMonth(month)) {
    return NextResponse.json(
      { ok: false, error: "Format bulan tidak valid." },
      { status: 400 }
    );
  }

  try {
    const { data: budget, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("month", month)
      .maybeSingle();

    if (error) throw error;

    if (!budget) {
      return NextResponse.json(
        { ok: false, error: "Anggaran tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: budget });
  } catch (err) {
    console.error("[api/budgets/[month]] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat anggaran. Coba lagi." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ month: string }> }
) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk mengubah anggaran." },
      { status: 401 }
    );
  }

  const { month } = await params;

  if (!isValidMonth(month)) {
    return NextResponse.json(
      { ok: false, error: "Format bulan tidak valid." },
      { status: 400 }
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

    const { data: updated, error } = await supabase
      .from("budgets")
      .update(parsed.data)
      .eq("user_id", data.user.id)
      .eq("month", month)
      .select("id");

    if (error) throw error;

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Anggaran tidak ditemukan atau bukan milikmu." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/budgets/[month]] PUT failed:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal mengubah anggaran. Coba lagi." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ month: string }> }
) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk menghapus anggaran." },
      { status: 401 }
    );
  }

  const { month } = await params;

  if (!isValidMonth(month)) {
    return NextResponse.json(
      { ok: false, error: "Format bulan tidak valid." },
      { status: 400 }
    );
  }

  try {
    const { data: deleted, error } = await supabase
      .from("budgets")
      .delete()
      .eq("user_id", data.user.id)
      .eq("month", month)
      .select("id");

    if (error) throw error;

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Anggaran tidak ditemukan atau bukan milikmu." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/budgets/[month]] DELETE failed:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus anggaran. Coba lagi." },
      { status: 500 }
    );
  }
}
