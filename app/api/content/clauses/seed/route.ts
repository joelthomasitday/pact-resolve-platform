import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type MediationClause } from "@/lib/db/schemas";

const sampleClauses = [
  {
    identifier: "A",
    title: "Standard Mediation Agreement",
    content: `Any dispute, conflict, or claim arising out of or in relation to this contract, including its existence, amendment, validity, interpretation, performance, breach, or termination, shall, as a condition precedent, be referred to mediation administered by PACT in accordance with its mediation rules and procedures in force at the time of commencement of the mediation.

The mediation shall be conducted on a confidential and without-prejudice basis, as per The Mediation Act, 2023. Nothing in this clause shall prevent any party from seeking interim relief from a court or tribunal of competent jurisdiction, where such relief is necessary.

The mediation shall be conducted and completed within a period of _________ (weeks/months). All parties involved agree to split the fees equally and participate in the mediation in _________ (online / in-person) mode`,
    order: 1,
    isActive: true,
  },
  {
    identifier: "B",
    title: "Multi-Tier Dispute Resolution",
    content: `Any dispute or claim arising out of or in connection with this contract shall first be referred to mediation administered by PACT, in accordance with its mediation rules for the time being in force.

If the dispute is not resolved by mediation within [60] days from the date of commencement of the mediation, or within such further period as the parties may mutually agree in writing, the dispute shall thereafter be referred to and finally resolved by [arbitration / litigation] in accordance with the dispute resolution provisions of this contract.

The commencement or continuation of mediation shall not prevent any party from seeking urgent interim relief.

The mediation shall be conducted and completed within a period of two months. All parties involved agree to split the fees equally and participate in the mediation in _________ (online / in-person) mode`,
    order: 2,
    isActive: true,
  },
  {
    identifier: "C",
    title: "Optional Mediation Clause",
    content: `The parties agree that, in the event of any dispute arising out of or relating to this contract, they shall, in good faith, consider referring the dispute to mediation administered by PACT, prior to initiating arbitration or litigation.

This clause reflects the parties' intention to explore consensual dispute resolution and does not constitute a mandatory bar to the initiation of formal proceedings.

The mediation shall be conducted and completed within a period of _________ (weeks/months). All parties involved agree to split the fees equally and participate in the mediation in _________ (online / in-person) mode`,
    order: 3,
    isActive: true,
  },
  {
    identifier: "D",
    title: "IP & Technology Disputes",
    content: `Any dispute, controversy, or claim arising out of or relating to this agreement, including disputes concerning intellectual property rights, licensing, confidentiality, or commercial performance, shall be referred to mediation administered by PACT, in accordance with its mediation rules.

The mediation shall be confidential, without prejudice, and conducted by a mediator with relevant subject-matter expertise, where appropriate.

The mediation shall be conducted and completed within a period of _________ (weeks/months). All parties involved agree to split the fees equally and participate in the mediation in _________ (online / in-person) mode`,
    order: 4,
    isActive: true,
  },
  {
    identifier: "E",
    title: "Comprehensive Mediation Clause",
    content: `Any dispute, controversy or claim arising out of or relating to this contract, including its existence, validity, interpretation, performance, breach or termination, shall first be referred to mediation administered by PACT under the PACT Mediation Rules in force on the date of commencement of mediation. The parties shall participate in good faith. Nothing prevents a party from seeking interim relief from a competent court / tribunal where necessary.

The mediation shall be conducted and completed within a period of _________ (weeks/months). All parties involved agree to split the fees equally and participate in the mediation in _________ (online / in-person) mode`,
    order: 5,
    isActive: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();

    const collection = db.collection<MediationClause>(COLLECTIONS.CLAUSES);
    
    // Clear existing
    await collection.deleteMany({});
    
    // Insert samples
    const now = new Date();
    const itemsToInsert = sampleClauses.map(item => ({
      ...item,
      createdAt: now,
      updatedAt: now,
    }));
    
    await collection.insertMany(itemsToInsert as MediationClause[]);
    
    return NextResponse.json({ success: true, message: "Clauses seeded successfully" });
  } catch (error: any) {
    console.error("Error seeding clauses:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to seed clauses" }, { status: 500 });
  }
}
