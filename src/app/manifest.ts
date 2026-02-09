import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Will You Be My Valentine? - Free Valentine Page Creator",
    short_name: "Be My Valentine",
    description:
      "Create your free personalized valentine page, share your link, and collect heartfelt valentine messages from the people who love you.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff1f2",
    theme_color: "#e11d48",
    orientation: "portrait",
    categories: ["entertainment", "social", "lifestyle"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/manifest-icon-192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/manifest-icon-512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
