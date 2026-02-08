"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBanner() {
  const pathname = usePathname();

  // Hide on home page (it already has sign-in) and setup page
  if (pathname === "/" || pathname === "/setup") return null;

  // On dashboard, show a different message
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-rose-dark/95 backdrop-blur-sm text-white text-center py-3 px-4 text-sm font-medium shadow-md">
      {isDashboard ? (
        <span>
          💝 Share your link and collect valentines!
        </span>
      ) : (
        <span>
          💝 Want your own valentine page?{" "}
          <Link href="/" className="underline decoration-white/50 underline-offset-4 hover:decoration-white hover:text-rose-light transition-all">
            Create yours free
          </Link>
        </span>
      )}
    </div>
  );
}
