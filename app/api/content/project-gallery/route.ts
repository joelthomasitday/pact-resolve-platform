import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type ProjectGalleryImage } from "@/lib/db/schemas";
import { ObjectId } from "mongodb";
import { AuditRepository } from "@/lib/db/repositories/audit-repository";

/**
 * GET /api/content/project-gallery
 * Fetch all gallery images or a specific one by ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const all = searchParams.get("all");
    
    const db = await getDb();
    const collection = db.collection<ProjectGalleryImage>(COLLECTIONS.PROJECT_GALLERY);
    
    if (id) {
      if (!ObjectId.isValid(id)) return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
      const item = await collection.findOne({ _id: new ObjectId(id) });
      if (!item) {
        return NextResponse.json({ success: false, error: "Gallery image not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: item });
    }
    
    let filter = {};
    if (all !== "true") {
      filter = { isActive: true };
    }
    
    let items = await collection.find(filter).sort({ order: 1 }).toArray();
    
    // Auto-seed if collection is completely empty and administrator is requesting all
    const totalCount = await collection.countDocuments({});
    if (totalCount === 0 && all === "true") {
      const defaultGallery = [
        { 
          image: { url: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80", alt: "Global Summit" }, 
          title: "Global Summit", 
          description: "Ceremonial highlights from the International Mediation Summit.",
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          image: { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80", alt: "Institutional Signing" }, 
          title: "Institutional Signing", 
          description: "Strengthening global partnerships through formal mediation agreements.",
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          image: { url: "https://images.unsplash.com/photo-1523287562758-66c7fc58967f?auto=format&fit=crop&q=80", alt: "Award Ceremony" }, 
          title: "Award Ceremony", 
          description: "Celebrating excellence and impact in the field of conflict resolution.",
          order: 3,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          image: { url: "https://images.unsplash.com/photo-1475721027187-4024733923f9?auto=format&fit=crop&q=80", alt: "Mediation Workshop" }, 
          title: "Mediation Workshop", 
          description: "Intensive skill development sessions for future mediators.",
          order: 4,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      
      await collection.insertMany(defaultGallery as ProjectGalleryImage[]);
      items = await collection.find(filter).sort({ order: 1 }).toArray();
    }
    
    return NextResponse.json({ 
      success: true, 
      data: items 
    });
  } catch (error) {
    console.error("Error fetching Project Gallery:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Project Gallery" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content/project-gallery
 * Create a new Project Gallery image (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const body = await request.json();
    
    const db = await getDb();
    const collection = db.collection<ProjectGalleryImage>(COLLECTIONS.PROJECT_GALLERY);
    
    const lastItem = await collection.findOne({}, { sort: { order: -1 } });
    const nextOrder = lastItem ? lastItem.order + 1 : 1;
    
    const newItem: Omit<ProjectGalleryImage, "_id"> = {
      image: body.image,
      title: body.title,
      description: body.description,
      order: body.order || nextOrder,
      isActive: body.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(newItem as ProjectGalleryImage);

    if (userId) {
      AuditRepository.log({
        userId,
        action: "CREATE_PROJECT_GALLERY_IMAGE",
        resource: "project_gallery",
        resourceId: result.insertedId.toString(),
        details: { title: body.title }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { _id: result.insertedId, ...newItem }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating Project Gallery image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create Project Gallery image" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content/project-gallery
 * Update a Project Gallery image (Admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }
    
    const db = await getDb();
    const collection = db.collection<ProjectGalleryImage>(COLLECTIONS.PROJECT_GALLERY);
    
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Gallery image not found" }, { status: 404 });
    }

    if (userId) {
      AuditRepository.log({
        userId,
        action: "UPDATE_PROJECT_GALLERY_IMAGE",
        resource: "project_gallery",
        resourceId: _id,
        details: { updatedFields: Object.keys(updateData) }
      });
    }
    
    return NextResponse.json({ success: true, message: "Gallery image updated successfully" });
  } catch (error) {
    console.error("Error updating Project Gallery image:", error);
    return NextResponse.json({ success: false, error: "Failed to update Project Gallery image" }, { status: 500 });
  }
}

/**
 * DELETE /api/content/project-gallery
 * Delete a Project Gallery image (Admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }
    
    const db = await getDb();
    const collection = db.collection<ProjectGalleryImage>(COLLECTIONS.PROJECT_GALLERY);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Gallery image not found" }, { status: 404 });
    }

    if (userId) {
      AuditRepository.log({
        userId,
        action: "DELETE_PROJECT_GALLERY_IMAGE",
        resource: "project_gallery",
        resourceId: id
      });
    }
    
    return NextResponse.json({ success: true, message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Error deleting Project Gallery image:", error);
    return NextResponse.json({ success: false, error: "Failed to delete Project Gallery image" }, { status: 500 });
  }
}
