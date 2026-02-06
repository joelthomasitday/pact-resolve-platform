
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/schemas";

export async function GET() {
  try {
    const db = await getDb();
    const dbName = db.databaseName;
    
    // Check counts for key collections
    const counts = {
      heroSlides: await db.collection(COLLECTIONS.HERO_SLIDES).countDocuments(),
      news: await db.collection(COLLECTIONS.NEWS).countDocuments(),
      panelMembers: await db.collection(COLLECTIONS.PANEL_MEMBERS).countDocuments(),
      partners: await db.collection(COLLECTIONS.PARTNERS).countDocuments(),
    };

    return NextResponse.json({
      success: true,
      env: process.env.NODE_ENV,
      dbName: dbName,
      counts: counts,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
