import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// P1-08..P1-10 (FR-04..FR-07): refresh session Supabase + guard route privat.
// Session disimpan di httpOnly cookie oleh Supabase (bukan password, P1).
const PROTECTED_PREFIXES = ["/dashboard", "/transactions", "/reports"];
const AUTH_PAGES = ["/login", "/register"];

function isPath(pathname: string, list: string[]): boolean {
  return list.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh token bila perlu (P1-10: login bertahan selama session berlaku).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // P1-09 / FR-05: halaman privat butuh session valid.
  if (!user && isPath(pathname, PROTECTED_PREFIXES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // User login tidak perlu lihat form auth lagi.
  if (user && isPath(pathname, AUTH_PAGES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
