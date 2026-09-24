import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getReportsData } from "@/lib/dashboard/dal";

/**
 * GET /api/reports/summary?type=income|expense&month=YYYY-MM
 * Agregasi bulanan milik user aktif (DESIGN.md §4.4, SRS P3-12).
 * Keamanan sama seperti /api/dashboard/summary: 401 generik tanpa
 * session, query scoped user_id dari session server (FR-14),
 * 500 selalu generik (P3-14, NFR-04).
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk melihat laporan." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);

  try {
    const reports = await getReportsData(
      searchParams.get("type"),
      searchParams.get("month"),
    );
    return NextResponse.json({ ok: true, data: reports });
  } catch (err) {
    console.error("[api/reports/summary] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat data laporan. Coba lagi." },
      { status: 500 },
    );
  }
}
