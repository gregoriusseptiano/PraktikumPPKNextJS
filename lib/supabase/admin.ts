import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const secret = process.env.SUPABASE_SECRET_KEY!;
  if (!url || !secret) {
    throw new Error("ENV_MISSING: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY belum diset");
  }
  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
