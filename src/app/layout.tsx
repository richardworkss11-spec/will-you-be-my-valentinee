import type { Metadata } from "next";
import { Dancing_Script, Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TopBanner from "@/components/ui/TopBanner";
import "./globals.css";

const SITE_URL = "https://www.will-you-be-my-valentinee.com";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Will You Be My Valentine? - Free Valentine Page Creator & Digital Card Maker",
    template: "%s | Will You Be My Valentine?",
  },
  description:
    "Create your free personalized valentine page, share your unique link, and collect heartfelt valentine messages from the people who love you. The easiest way to send and receive digital valentines online.",
  keywords: [
    "valentine page creator",
    "send valentine online",
    "digital valentine card",
    "will you be my valentine",
    "valentine message generator",
    "valentine wall",
    "online valentine card maker",
    "free valentine card",
    "personalized valentine",
    "valentine card generator",
    "valentine greeting page",
    "share valentine link",
    "valentine message board",
    "valentine surprise page",
    "galentine page",
    "valentine for boyfriend",
    "valentine for girlfriend",
    "last minute valentine card online free",
    "create valentine card online free",
  ],
  applicationName: "Will You Be My Valentine?",
  authors: [{ name: "Will You Be My Valentine?" }],
  creator: "Will You Be My Valentine?",
  publisher: "Will You Be My Valentine?",
  category: "Entertainment",
  classification: "Valentine's Day, Greeting Cards, Social",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Will You Be My Valentine?",
    title:
      "Will You Be My Valentine? - Free Valentine Page Creator & Digital Card Maker",
    description:
      "Create your free personalized valentine page, share your unique link, and collect heartfelt valentine messages. The easiest way to send digital valentines online.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Will You Be My Valentine? - Create your free valentine page and collect heartfelt messages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Will You Be My Valentine? - Free Valentine Page Creator",
    description:
      "Create your free personalized valentine page, share your link, and collect heartfelt valentine messages online.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Will You Be My Valentine?",
    url: SITE_URL,
    description:
      "Create your free personalized valentine page, share your unique link, and collect heartfelt valentine messages from the people who love you.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/{username}`,
      },
      "query-input": "required name=username",
    },
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Will You Be My Valentine?",
    url: SITE_URL,
    description:
      "Create your personal valentine page, share it with loved ones, and collect heartfelt valentine messages on your wall of love. Free online valentine card maker.",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "All",
    browserRequirements: "Requires a modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Create personalized valentine pages",
      "Share unique valentine link",
      "Collect valentine messages",
      "Public wall of love",
      "Photo upload support",
      "Social media sharing",
      "Privacy controls for senders",
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Will You Be My Valentine?",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I create a valentine page?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply sign in with Google, choose a unique username, and your personal valentine page is ready! Share your link with friends and loved ones so they can send you heartfelt valentine messages.",
        },
      },
      {
        "@type": "Question",
        name: "Is it free to create a valentine page?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, completely free! Create your page, share it, and receive unlimited valentine messages at no cost.",
        },
      },
      {
        "@type": "Question",
        name: "Can I control who sees my valentines?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each sender controls whether their valentine appears on your public wall. You always see all valentines in your private dashboard. Senders can also choose their display name and whether their photo is visible.",
        },
      },
      {
        "@type": "Question",
        name: "How do I send a valentine to someone?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Visit their unique valentine page link, click 'Yes' to be their valentine, and fill in your heartfelt message with optional photo, song, and more. No sign-up required to send!",
        },
      },
      {
        "@type": "Question",
        name: "What can I include in a valentine message?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can include your name, a personal message, a photo, a dedicated song, a special date, your location, your Instagram handle, and the reason why they're special to you.",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
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
