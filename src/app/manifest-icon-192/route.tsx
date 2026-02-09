import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          borderRadius: "40px",
        }}
      >
        <div style={{ fontSize: 140, lineHeight: 1 }}>💝</div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
