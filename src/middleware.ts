import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Protected routes: require auth
  if (pathname === "/setup" || pathname === "/dashboard") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Check if user has a profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .single();

    if (pathname === "/setup" && profile) {
      // Already has profile → go to dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    if (pathname === "/dashboard" && !profile) {
      // No profile yet → go to setup
      const url = request.nextUrl.clone();
      url.pathname = "/setup";
      return NextResponse.redirect(url);
    }
  }

  // If authed user visits their own username page → redirect to dashboard
  if (user && pathname.startsWith("/") && pathname.split("/").length === 2) {
    const potentialUsername = pathname.slice(1);
    if (potentialUsername && !["setup", "dashboard", "auth", "api"].includes(potentialUsername)) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .single();

      if (profile && profile.username.toLowerCase() === potentialUsername.toLowerCase()) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
