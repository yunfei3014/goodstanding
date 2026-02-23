import { NextResponse } from "next/server"

/**
 * GET /api/health
 * Simple health check endpoint for uptime monitoring.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: "goodstanding.ai",
  })
}
