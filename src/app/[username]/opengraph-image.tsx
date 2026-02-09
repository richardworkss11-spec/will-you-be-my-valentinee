import { ImageResponse } from "next/og";
import { getProfileByUsername } from "@/lib/queries";

export const runtime = "edge";
export const alt = "Will You Be My Valentine?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  const name = profile?.display_name || "Someone special";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff1f2, #ffe4e6, #fecdd3)",
          position: "relative",
        }}
      >
        {/* Corner hearts */}
        <div style={{ position: "absolute", top: 40, left: 60, fontSize: 64, opacity: 0.15, display: "flex" }}>💕</div>
        <div style={{ position: "absolute", bottom: 40, right: 60, fontSize: 64, opacity: 0.15, display: "flex" }}>💕</div>
        <div style={{ position: "absolute", top: 50, right: 80, fontSize: 48, opacity: 0.1, display: "flex" }}>💝</div>
        <div style={{ position: "absolute", bottom: 50, left: 80, fontSize: 48, opacity: 0.1, display: "flex" }}>💌</div>

        {/* Heart icon */}
        <div style={{ fontSize: 100, display: "flex", marginBottom: 16 }}>💝</div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#9f1239",
            textAlign: "center",
            display: "flex",
          }}
        >
          Will You Be My Valentine?
        </div>

        {/* Name */}
        <div
          style={{
            marginTop: 16,
            fontSize: 36,
            color: "#be123c",
            opacity: 0.8,
            display: "flex",
          }}
        >
          from {name}
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: "#e11d48",
            opacity: 0.5,
            display: "flex",
          }}
        >
          will-you-be-my-valentinee.com
        </div>
      </div>
    ),
    { ...size }
  );
}
