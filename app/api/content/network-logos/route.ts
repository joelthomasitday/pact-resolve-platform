import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type NetworkLogo } from "@/lib/db/schemas";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const db = await getDb();
    const query = isAdmin ? {} : { isActive: true };
    const items = await db.collection<NetworkLogo>(COLLECTIONS.NETWORK_LOGOS).find(query).sort({ order: 1 }).toArray();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    const newItem = { ...body, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection(COLLECTIONS.NETWORK_LOGOS).insertOne(newItem);
    revalidatePath("/");
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newItem } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    const db = await getDb();
    await db.collection(COLLECTIONS.NETWORK_LOGOS).updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    const db = await getDb();
    await db.collection(COLLECTIONS.NETWORK_LOGOS).deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}
