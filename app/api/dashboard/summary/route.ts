import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/dal";

/**
 * GET /api/dashboard/summary — ringkasan + transaksi terbaru milik
 * user aktif (Modul E/F, SRS P3-02..P3-05, P3-12).
 *
 * Keamanan (SRS P3-08..P3-14, NFR-02, NFR-04):
 * - 401 generik bila tanpa session valid, tanpa detail penyebab.
 * - Semua query di DAL difilter user_id dari session server (FR-14).
 * - 500 selalu generik; detail error hanya di log server.
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk melihat dashboard." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");

  try {
    const dashboard = await getDashboardData(limit);
    return NextResponse.json({ ok: true, data: dashboard });
  } catch (err) {
    console.error("[api/dashboard/summary] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat data dashboard. Coba lagi." },
      { status: 500 },
    );
  }
}
