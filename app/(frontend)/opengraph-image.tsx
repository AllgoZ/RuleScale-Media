import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/constants";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#201e1d",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(236, 48, 19, 0.16)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 42 42" fill="none">
            <circle cx="21" cy="21" r="17" stroke="#f3f2f2" strokeWidth="3.5" />
            <path d="M23 6 L14 21 L21 21 L18 36 L29 19 L21 19 Z" fill="#ec3013" />
          </svg>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#f3f2f2",
              letterSpacing: "-0.02em",
            }}
          >
            RuleScale Media
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            color: "#f3f2f2",
            marginTop: 48,
            maxWidth: 920,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "rgba(243,242,242,0.55)",
            marginTop: 28,
          }}
        >
          Website · SEO · Social · Influencer · Video · Performance Marketing
        </div>
      </div>
    ),
    { ...size }
  );
}
