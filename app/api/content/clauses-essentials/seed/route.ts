import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/schemas";

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTIONS.CLAUSES_ESSENTIALS);

    const defaultEssentials = [
      {
        title: "Name of Institution or Service Provider",
        description: "Explicitly naming PACT or a professional provider ensures structured administration and procedural certainty.",
        image: {
          url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
          alt: "Name of Institution"
        },
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Timeline for Mediation",
        description: "Defining clear timeframes (e.g., 60 days) prevents open-ended disputes and ensures focused negotiations.",
        image: {
          url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop",
          alt: "Timeline"
        },
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Agreement on Splitting Expenses",
        description: "Pre-agreeing on cost-sharing maintain neutrality and demonstrates equal commitment from all parties.",
        image: {
          url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop",
          alt: "Expenses"
        },
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Mode of Representation",
        description: "Specifying Online, In-person, or Hybrid modes allows for better logistical planning and cost optimization.",
        image: {
          url: "https://images.unsplash.com/photo-1573497019707-1c042488f49a?q=80&w=2070&auto=format&fit=crop",
          alt: "Representation"
        },
        order: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Clear existing
    await collection.deleteMany({});
    
    // Insert defaults
    await collection.insertMany(defaultEssentials);

    return NextResponse.json({ 
      success: true, 
      message: "Clauses essentials seeded successfully",
      count: defaultEssentials.length 
    });
  } catch (error: any) {
    console.error("Error seeding clauses essentials:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
