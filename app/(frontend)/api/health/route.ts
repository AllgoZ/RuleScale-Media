import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/cms/payload-client";

export async function GET() {
  const checks: { app: "ok"; database: "ok" | "error" } = {
    app: "ok",
    database: "ok",
  };

  try {
    const payload = await getPayloadClient();
    await payload.db.drizzle.execute(sql`select 1`);
  } catch (error) {
    console.error("[health] Database connectivity check failed", error);
    checks.database = "error";
  }

  const healthy = checks.database === "ok";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
