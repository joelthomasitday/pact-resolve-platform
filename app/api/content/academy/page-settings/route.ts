import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/schemas";
import { ObjectId } from "mongodb";
import { AuditRepository } from "@/lib/db/repositories/audit-repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const program = searchParams.get("program");
    const { db } = await connectToDatabase();

    if (program) {
      const settings = await db.collection(COLLECTIONS.ACADEMY_PAGE_SETTINGS).findOne({ program });
      return NextResponse.json({ success: true, data: settings });
    }

    const settings = await db.collection(COLLECTIONS.ACADEMY_PAGE_SETTINGS).find({}).toArray();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch academy page settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Add updatedAt
    updateData.updatedAt = new Date();

    const result = await db.collection(COLLECTIONS.ACADEMY_PAGE_SETTINGS).updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (userId) {
      AuditRepository.log({
        userId,
        action: "UPDATE_ACADEMY_PAGE_SETTINGS",
        resource: `academy_page_settings_${body.program}`,
        details: { program: body.program }
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update academy page settings" }, { status: 500 });
  }
}
