import { NextRequest, NextResponse } from "next/server";
import { AuditRepository } from "@/lib/db/repositories/audit-repository";
import { requireAdmin } from "@/lib/auth/protect";

/**
 * GET /api/audit-logs
 * Fetch recent audit logs (Admin only)
 */
export const GET = requireAdmin(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const userId = searchParams.get("userId") || undefined;
    const action = searchParams.get("action") || undefined;

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (action) filter.action = action;

    const logs = await AuditRepository.getLogs(filter, limit);

    return NextResponse.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
});
