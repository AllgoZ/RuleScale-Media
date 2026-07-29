export function LeadsExportButton() {
  return (
    <div style={{ marginBottom: 16 }}>
      {/* Plain <a>, not next/link: triggers a file download, not a page navigation. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/api/leads/export"
        style={{
          display: "inline-block",
          padding: "8px 16px",
          borderRadius: 6,
          border: "1px solid rgba(0,0,0,0.15)",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          color: "#201e1d",
        }}
      >
        Download CSV
      </a>
    </div>
  );
}
