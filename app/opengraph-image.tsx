import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f8fafc",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "#1B2B4B",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Shield icon — inline SVG path */}
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3L4 7v5c0 5 3.5 9.74 8 11 4.5-1.26 8-6 8-11V7l-8-4z"
                fill="#34d399"
              />
            </svg>
          </div>
          <span style={{ fontSize: "28px", fontWeight: 800, color: "#1B2B4B" }}>
            GoodStanding
            <span style={{ color: "#10b981" }}>.ai</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1.1,
            maxWidth: "900px",
            marginBottom: "28px",
          }}
        >
          Startup compliance,
          <br />
          <span style={{ color: "#10b981" }}>automated.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "26px",
            color: "#64748b",
            fontWeight: 400,
            maxWidth: "760px",
            lineHeight: 1.5,
            marginBottom: "48px",
          }}
        >
          We form, we file, we call the government on your behalf.
          Enrolled Agent licensed. Free to start.
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["Entity Formation", "Annual Filings", "IRS Liaison", "Compliance Tracking"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  background: "#f0fdf4",
                  border: "1.5px solid #bbf7d0",
                  borderRadius: "9999px",
                  padding: "8px 20px",
                  fontSize: "16px",
                  color: "#166534",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>

        {/* Right decoration */}
        <div
          style={{
            position: "absolute",
            right: "80px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            opacity: 0.7,
          }}
        >
          {[
            { label: "Good standing", color: "#10b981" },
            { label: "Filed ✓",       color: "#10b981" },
            { label: "Pending",       color: "#f59e0b" },
            { label: "IRS resolved",  color: "#10b981" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "14px 20px",
                fontSize: "15px",
                fontWeight: 600,
                color: item.color,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                minWidth: "180px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: item.color,
                }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
