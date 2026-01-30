import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? "SET" : "MISSING",
      MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "NOT SET (using default)",
      JWT_SECRET: process.env.JWT_SECRET ? "SET" : "MISSING",
    },
    database: "pending"
  };

  try {
    const db = await getDb();
    const userCount = await db.collection("users").countDocuments();
    checks.database = "connected";
    checks.userCount = userCount;
    checks.dbName = db.databaseName;
  } catch (error: any) {
    checks.database = "FAILED";
    checks.dbError = error?.message || "Unknown error";
  }

  return NextResponse.json(checks);
}
