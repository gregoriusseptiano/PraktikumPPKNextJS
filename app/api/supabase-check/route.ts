import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return Response.json(
      { ok: false, error: "ENV_MISSING: NEXT_PUBLIC_SUPABASE_URL / ANON_KEY belum diset" },
      { status: 500 }
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();
    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }
    return Response.json({ ok: true, url, connected: true });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown error" },
      { status: 500 }
    );
  }
}
