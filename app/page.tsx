import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Root: arahkan berdasarkan session (P1-08/P1-09).
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/dashboard" : "/login");
}
