import { ImageResponse } from "next/og";
import { getProfileByUsername, getWallValentines } from "@/lib/queries";

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

  const valentines = await getWallValentines(profile.id);
  const count = valentines.length;

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
        {/* Decorative */}
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 50,
            fontSize: 80,
            opacity: 0.1,
            display: "flex",
          }}
        >
          💌
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 50,
            fontSize: 80,
            opacity: 0.1,
            display: "flex",
          }}
        >
          💌
        </div>

        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            width={120}
            height={120}
            style={{
              borderRadius: "50%",
              border: "5px solid white",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fb7185, #f472b6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              border: "5px solid white",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
          >
            💝
          </div>
        )}

        {/* Title */}
        <div
          style={{
            marginTop: 28,
            fontSize: 48,
            fontWeight: 700,
            color: "#9f1239",
            display: "flex",
          }}
        >
          {profile.display_name}&apos;s Wall of Love
        </div>

        {/* Count */}
        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            color: "#be123c",
            opacity: 0.7,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {count > 0
            ? `${count} valentine${count !== 1 ? "s" : ""} and counting!`
            : "Be the first to send a valentine!"}
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: "#e11d48",
            opacity: 0.5,
            display: "flex",
          }}
        >
          💝 /{profile.username}/wall
        </div>
      </div>
    ),
    { ...size }
  );
}
