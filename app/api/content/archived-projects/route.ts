import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type ArchivedProject } from "@/lib/db/schemas";
import { ObjectId } from "mongodb";
import { AuditRepository } from "@/lib/db/repositories/audit-repository";

/**
 * GET /api/content/archived-projects
 * Fetch all archived projects or a specific one by ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const all = searchParams.get("all");
    
    const db = await getDb();
    const collection = db.collection<ArchivedProject>(COLLECTIONS.ARCHIVED_PROJECTS);
    
    if (id) {
      if (!ObjectId.isValid(id)) return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
      const project = await collection.findOne({ _id: new ObjectId(id) });
      if (!project) {
        return NextResponse.json({ success: false, error: "Archived project not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: project });
    }
    
    let filter = {};
    if (all !== "true") {
      filter = { isActive: true };
    }
    
    let projects = await collection.find(filter).sort({ order: 1 }).toArray();

    // Auto-seed if collection is completely empty and administrator is requesting all
    const totalCount = await collection.countDocuments({});
    if (totalCount === 0 && all === "true") {
      const legacyProjects = [
        {
          title: "BITS Law School | Panel on Mediation & Arbitration in International Commercial Conflicts",
          location: "Mumbai, 2025",
          description: "Exploring how mixed-mode dispute resolution is shaping cross-border business disputes and India's evolving position in that space.",
          link: "https://www.youtube.com/watch?v=nQLB_E2Z3hg",
          category: "Webinar",
          image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80",
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Saveetha School of Law - Three-Day Workshop on Mediation",
          location: "Chennai, 2024",
          description: "Intensive skills workshop introducing core mediation principles, empathic listening, and the IMPACT model.",
          link: "https://saveethalaw.com/news/three-day-workshop-on-mediation",
          category: "Workshop",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "SRM University Delhi-NCR (Haryana) - Mediation & Negotiation Workshop",
          location: "Sonepat, 2023",
          description: "Two-day workshop for final-year students on mediator qualities and practical negotiation strategy.",
          link: "https://srmuniversity.ac.in/event/workshop-on-mediation-and-negotiation",
          category: "Workshop",
          image: "https://images.unsplash.com/photo-1577891729319-f4871c6ecdf1?auto=format&fit=crop&q=80",
          order: 3,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Manav Rachna University – Mediation Bootcamp",
          location: "Faridabad, 2023",
          description: "A intensive Bootcamp organised by MRU's Centre of Excellence on ADR with Jonathan Rodrigues as trainer.",
          link: "https://manavrachna.edu.in/assets/campus/mru/pdf/sol-newsletter-4.pdf",
          category: "Bootcamp",
          image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80",
          order: 4,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "LedX × The PACT – Mediation & Conflict Bootcamp",
          location: "Indore, 2022",
          description: "Indore based bootcamp teaching foundational mediation concepts and client-counselling techniques.",
          link: "https://classroom.ledx.law/bootcamp-on-mediation-client-counselling/",
          category: "Bootcamp",
          image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80",
          order: 5,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Lawctopus × The PACT – Online ADR Bootcamp",
          location: "Online, 2020",
          description: "Online intensive training students and young professionals on negotiation strategy and mediation process.",
          link: "https://www.lawctopus.com/adrbootcamp/",
          category: "Online Bootcamp",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
          order: 6,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await collection.insertMany(legacyProjects as ArchivedProject[]);
      projects = await collection.find(filter).sort({ order: 1 }).toArray();
    }
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching Archived Projects:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch Archived Projects" }, { status: 500 });
  }
}

/**
 * POST /api/content/archived-projects - Create new archived project
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const body = await request.json();
    
    const db = await getDb();
    const collection = db.collection<ArchivedProject>(COLLECTIONS.ARCHIVED_PROJECTS);
    
    const lastProject = await collection.findOne({}, { sort: { order: -1 } });
    const nextOrder = lastProject ? lastProject.order + 1 : 1;
    
    const newProject: Omit<ArchivedProject, "_id"> = {
      title: body.title,
      location: body.location,
      description: body.description,
      link: body.link,
      category: body.category,
      image: body.image,
      order: body.order || nextOrder,
      isActive: body.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(newProject as ArchivedProject);

    if (userId) {
      AuditRepository.log({
        userId,
        action: "CREATE_ARCHIVED_PROJECT",
        resource: "archived_projects",
        resourceId: result.insertedId.toString(),
        details: { title: body.title }
      });
    }
    
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newProject } }, { status: 201 });
  } catch (error) {
    console.error("Error creating Archived Project:", error);
    return NextResponse.json({ success: false, error: "Failed to create Archived Project" }, { status: 500 });
  }
}

/**
 * PUT /api/content/archived-projects - Update archived project
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }
    
    const db = await getDb();
    const collection = db.collection<ArchivedProject>(COLLECTIONS.ARCHIVED_PROJECTS);
    
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    if (userId) {
      AuditRepository.log({
        userId,
        action: "UPDATE_ARCHIVED_PROJECT",
        resource: "archived_projects",
        resourceId: _id,
        details: { updatedFields: Object.keys(updateData) }
      });
    }
    
    return NextResponse.json({ success: true, message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating Archived Project:", error);
    return NextResponse.json({ success: false, error: "Failed to update Archived Project" }, { status: 500 });
  }
}

/**
 * DELETE /api/content/archived-projects - Delete archived project
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }
    
    const db = await getDb();
    const collection = db.collection<ArchivedProject>(COLLECTIONS.ARCHIVED_PROJECTS);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    if (userId) {
      AuditRepository.log({
        userId,
        action: "DELETE_ARCHIVED_PROJECT",
        resource: "archived_projects",
        resourceId: id
      });
    }
    
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting Archived Project:", error);
    return NextResponse.json({ success: false, error: "Failed to delete Archived Project" }, { status: 500 });
  }
}
