import type { Metadata } from "next";
import { Dancing_Script, Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TopBanner from "@/components/ui/TopBanner";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Valentine's Day | Create Your Valentine Page",
  description:
    "Create your personal valentine page, share your link, and collect valentines from the people who love you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dancingScript.variable} ${quicksand.variable} antialiased`}
      >
        <TopBanner />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
