import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type AboutPactSettings } from "@/lib/db/schemas";
import { revalidatePath } from "next/cache";
import { AuditRepository } from "@/lib/db/repositories/audit-repository";

export async function GET() {
  try {
    const db = await getDb();
    const settings = await db.collection<AboutPactSettings>(COLLECTIONS.ABOUT_PACT).findOne({});
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch about settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const body = await request.json();
    const { _id, ...updateData } = body;

    const db = await getDb();
    const result = await db.collection<AboutPactSettings>(COLLECTIONS.ABOUT_PACT).updateOne(
      {},
      { $set: { ...updateData, updatedAt: new Date() } },
      { upsert: true }
    );

    revalidatePath("/");
    revalidatePath("/admin/home-page");

    if (userId) {
      AuditRepository.log({
        userId,
        action: "UPDATE_ABOUT_PACT",
        resource: "about_pact",
        details: { changes: updateData }
      });
    }

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}
