import { ImageResponse } from "next/og";
import { getProfileByUsername } from "@/lib/queries";

export const runtime = "edge";
export const alt = "Valentine's Day";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #e11d48, #ec4899)",
            color: "white",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Not Found
        </div>
      ),
      { ...size }
    );
  }

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
            top: 40,
            left: 60,
            fontSize: 64,
            opacity: 0.15,
            display: "flex",
          }}
        >
          💕
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 64,
            opacity: 0.15,
            display: "flex",
          }}
        >
          💕
        </div>

        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            width={140}
            height={140}
            style={{
              borderRadius: "50%",
              border: "6px solid white",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fb7185, #f472b6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              border: "6px solid white",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
          >
            💝
          </div>
        )}

        {/* Title */}
        <div
          style={{
            marginTop: 32,
            fontSize: 52,
            fontWeight: 700,
            color: "#9f1239",
            textAlign: "center",
            display: "flex",
          }}
        >
          Will you be my Valentine?
        </div>

        {/* Name */}
        <div
          style={{
            marginTop: 12,
            fontSize: 36,
            color: "#be123c",
            opacity: 0.8,
            display: "flex",
          }}
        >
          from {profile.display_name}
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: "#e11d48",
            opacity: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          💝 /{profile.username}
        </div>
      </div>
    ),
    { ...size }
  );
}
