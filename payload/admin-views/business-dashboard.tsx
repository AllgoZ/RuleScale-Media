import { getPayloadClient } from "@/lib/cms/payload-client";
import type { Lead } from "@/payload-types";

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function countBy(leads: Lead[], getKey: (lead: Lead) => string | null | undefined): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const lead of leads) {
    const key = getKey(lead);
    if (!key) continue;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export async function BusinessDashboardView() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "leads",
    limit: 10000,
    depth: 0,
    sort: "-createdAt",
  });
  const leads = result.docs;

  const total = leads.length;
  const statusCounts = countBy(leads, (lead) => lead.status);
  const won = statusCounts.won || 0;
  const lost = statusCounts.lost || 0;
  const newCount = statusCounts.new || 0;
  const conversionRate = total > 0 ? Math.round((won / total) * 1000) / 10 : 0;

  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    months.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  }
  const monthlyCounts: Record<string, number> = {};
  for (const lead of leads) {
    const key = monthKey(new Date(lead.createdAt));
    monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
  }
  const maxMonthly = Math.max(1, ...months.map((key) => monthlyCounts[key] || 0));

  const serviceCounts: Record<string, number> = {};
  for (const lead of leads) {
    for (const service of lead.servicesInterested || []) {
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    }
  }
  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const sourceCounts = countBy(leads, (lead) => lead.source);
  const sourceEntries = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ padding: "40px 32px", maxWidth: 960, fontFamily: "system-ui, sans-serif", color: "#201e1d" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Business dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <StatCard label="Total leads" value={total} />
        <StatCard label="New" value={newCount} />
        <StatCard label="Won" value={won} />
        <StatCard label="Lost" value={lost} />
        <StatCard label="Conversion rate" value={`${conversionRate}%`} />
      </div>

      <Section title="Monthly lead count">
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>
          {months.map((key) => {
            const count = monthlyCounts[key] || 0;
            const height = Math.round((count / maxMonthly) * 90) + 10;
            return (
              <div
                key={key}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}
              >
                <div style={{ fontSize: 12, color: "#6f6b68" }}>{count}</div>
                <div style={{ width: "100%", height, backgroundColor: "#ec3013", borderRadius: 4 }} />
                <div style={{ fontSize: 11, color: "#6f6b68" }}>{monthLabel(key)}</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Most requested services">
        <BarList entries={topServices} />
      </Section>

      <Section title="Lead sources">
        <BarList entries={sourceEntries} />
      </Section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: "1px solid rgba(32,30,29,0.12)", borderRadius: 12, padding: "16px 20px" }}>
      <div style={{ fontSize: 12, color: "#6f6b68", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 16,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "#6f6b68",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function BarList({ entries }: { entries: [string, number][] }) {
  if (!entries.length) {
    return <p style={{ color: "#6f6b68", fontSize: 14 }}>No data yet.</p>;
  }
  const max = Math.max(...entries.map(([, count]) => count));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {entries.map(([label, count]) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 160, fontSize: 13, textTransform: "capitalize" }}>
            {label.replace(/-/g, " ")}
          </div>
          <div
            style={{
              flex: 1,
              height: 8,
              backgroundColor: "rgba(32,30,29,0.06)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${(count / max) * 100}%`, height: "100%", backgroundColor: "#ec3013" }} />
          </div>
          <div style={{ width: 32, textAlign: "right", fontSize: 13, color: "#6f6b68" }}>{count}</div>
        </div>
      ))}
    </div>
  );
}
