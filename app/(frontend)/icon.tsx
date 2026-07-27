import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#201e1d",
          borderRadius: 14,
        }}
      >
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <circle
            cx="21"
            cy="21"
            r="17"
            stroke="#f3f2f2"
            strokeWidth="3.5"
          />
          <path
            d="M23 6 L14 21 L21 21 L18 36 L29 19 L21 19 Z"
            fill="#ec3013"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
