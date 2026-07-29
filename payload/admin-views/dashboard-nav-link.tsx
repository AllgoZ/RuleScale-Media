import Link from "next/link";

export function BusinessDashboardNavLink() {
  return (
    <div style={{ padding: "8px 20px" }}>
      <Link
        href="/admin/business-dashboard"
        style={{ fontSize: 13, fontWeight: 600, color: "#ec3013", textDecoration: "none" }}
      >
        Business dashboard
      </Link>
    </div>
  );
}
