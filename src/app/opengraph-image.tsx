import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Will You Be My Valentine? - Create your free valentine page and collect heartfelt messages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
        {/* Decorative hearts */}
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 50,
            fontSize: 80,
            opacity: 0.12,
            display: "flex",
          }}
        >
          💕
        </div>
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 80,
            fontSize: 60,
            opacity: 0.1,
            display: "flex",
          }}
        >
          💝
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 80,
            opacity: 0.12,
            display: "flex",
          }}
        >
          💕
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            fontSize: 60,
            opacity: 0.1,
            display: "flex",
          }}
        >
          💌
        </div>

        {/* Main heart */}
        <div
          style={{
            fontSize: 100,
            display: "flex",
            marginBottom: 20,
          }}
        >
          💝
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#9f1239",
            textAlign: "center",
            display: "flex",
            lineHeight: 1.2,
          }}
        >
          Will You Be My Valentine?
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "#be123c",
            opacity: 0.7,
            textAlign: "center",
            display: "flex",
            maxWidth: 800,
          }}
        >
          Create your free valentine page & collect heartfelt messages
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            color: "#e11d48",
            opacity: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          will-you-be-my-valentinee.com
        </div>
      </div>
    ),
    { ...size }
  );
}
