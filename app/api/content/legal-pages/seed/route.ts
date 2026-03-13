import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/schemas";
import { legalPagesSeed } from "@/lib/db/seed-data";

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTIONS.LEGAL_PAGES);

    // Filter out only privacy and terms
    const seeds = legalPagesSeed.map(item => ({
      ...item,
      updatedAt: new Date(),
      createdAt: new Date()
    }));

    let count = 0;
    for (const seed of seeds) {
      const result = await collection.updateOne(
        { slug: seed.slug },
        { $set: seed },
        { upsert: true }
      );
      if (result.matchedCount > 0 || result.upsertedCount > 0) {
        count++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${count} legal pages seeded successfully`,
      count
    });
  } catch (error) {
    console.error("Legal pages seed error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed legal pages" },
      { status: 500 }
    );
  }
}
