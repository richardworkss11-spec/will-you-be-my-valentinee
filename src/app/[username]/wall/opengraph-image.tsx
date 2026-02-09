import { ImageResponse } from "next/og";
import { getProfileByUsername } from "@/lib/queries";

export const runtime = "edge";
export const alt = "Wall of Love";
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
          background: "linear-gradient(135deg, #fff1f2, #fce7f3, #fdf2f8)",
          position: "relative",
        }}
      >
        {/* Corner decorations */}
        <div style={{ position: "absolute", top: 30, right: 50, fontSize: 80, opacity: 0.1, display: "flex" }}>💌</div>
        <div style={{ position: "absolute", bottom: 30, left: 50, fontSize: 80, opacity: 0.1, display: "flex" }}>💌</div>

        {/* Heart icon */}
        <div style={{ fontSize: 100, display: "flex", marginBottom: 16 }}>💝</div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#9f1239",
            display: "flex",
          }}
        >
          {name}&apos;s Wall of Love
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            color: "#be123c",
            opacity: 0.7,
            display: "flex",
          }}
        >
          See all the valentines & send your own!
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
