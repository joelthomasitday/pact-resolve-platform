import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type GlobalSettings } from "@/lib/db/schemas";
import { globalSettingsSchema } from "@/lib/validation/schemas";
import { AuditRepository } from "@/lib/db/repositories/audit-repository";

/**
 * GET /api/content/global-settings
 * Fetch global settings
 */
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const collectionName = COLLECTIONS.GLOBAL_SETTINGS;
    const collection = db.collection<GlobalSettings>(collectionName);
    
    // Debug logging as per DATABASE_AND_ADMIN_GUIDELINES.md
    console.log(`[GlobalSettings API] Database: ${db.databaseName}`);
    console.log(`[GlobalSettings API] Collection: ${collectionName}`);
    
    const documentCount = await collection.countDocuments();
    console.log(`[GlobalSettings API] Document count: ${documentCount}`);
    
    const settings = await collection.findOne({});
    
    // Return empty state with success: true but data: null to distinguish from errors
    if (!settings) {
      console.log("[GlobalSettings API] No settings document found - returning empty state");
      return NextResponse.json({ 
        success: true, 
        data: null,
        isEmpty: true,
        message: "No global settings configured yet"
      });
    }
    
    console.log(`[GlobalSettings API] Found settings document with ID: ${settings._id}`);
    
    return NextResponse.json({ 
      success: true, 
      data: settings,
      isEmpty: false
    });
  } catch (error) {
    console.error("[GlobalSettings API] Error fetching global settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch global settings" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content/global-settings
 * Update global settings (Admin only - enforced by middleware)
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const role = request.headers.get("x-user-role");
    
    const body = await request.json();
    console.log("[GlobalSettings API] PUT request received:", JSON.stringify(body, null, 2));
    
    // 1. Validation
    const validation = globalSettingsSchema.safeParse(body);
    if (!validation.success) {
      console.error("[GlobalSettings API] Validation failed:", validation.error.format());
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collectionName = COLLECTIONS.GLOBAL_SETTINGS;
    const collection = db.collection<GlobalSettings>(collectionName);
    
    // Debug logging as per DATABASE_AND_ADMIN_GUIDELINES.md
    console.log(`[GlobalSettings API] PUT - Database: ${db.databaseName}`);
    console.log(`[GlobalSettings API] PUT - Collection: ${collectionName}`);
    
    // 2. Database Update
    const result = await collection.updateOne(
      {}, 
      { 
        $set: { 
          ...validation.data, 
          updatedAt: new Date() 
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log(`[GlobalSettings API] PUT - Update result: matched=${result.matchedCount}, modified=${result.modifiedCount}, upserted=${result.upsertedCount}`);
    
    // 3. Audit Logging (Async, no await to prevent latency)
    if (userId) {
      AuditRepository.log({
        userId,
        action: "UPDATE_GLOBAL_SETTINGS",
        resource: "global_settings",
        details: { changes: validation.data }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Global settings updated successfully",
    });
  } catch (error) {
    console.error("[GlobalSettings API] Error updating global settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update global settings" },
      { status: 500 }
    );
  }
}
