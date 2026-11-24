import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/constants";

const LOGO_DATA_URI = `data:image/png;base64,${readFileSync(
  path.join(process.cwd(), "public", "logo.png")
).toString("base64")}`;

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA_URI} width={56} height={56} alt="" />

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
