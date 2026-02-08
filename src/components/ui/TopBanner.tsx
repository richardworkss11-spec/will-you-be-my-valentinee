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
    <div className="relative z-50 bg-rose-dark/90 backdrop-blur-sm text-white text-center py-2 px-4 text-sm">
      {isDashboard ? (
        <span>
          💝 Share your link and collect valentines!
        </span>
      ) : (
        <span>
          💝 Want your own valentine page?{" "}
          <Link href="/" className="underline font-semibold hover:text-rose-light transition-colors">
            Create yours free
          </Link>
        </span>
      )}
    </div>
  );
}
