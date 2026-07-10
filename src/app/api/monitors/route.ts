import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MonitorModel } from "@/lib/models/Monitor";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const filter: Record<string, unknown> = {};
    const panel = searchParams.get("panel");
    const minRefresh = searchParams.get("minRefresh");
    const maxPrice = searchParams.get("maxPrice");
    const hdr = searchParams.get("hdr");
    const search = searchParams.get("search");

    if (panel && panel !== "all") filter.panel = panel;
    if (minRefresh) filter.refreshRate = { $gte: Number(minRefresh) };
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (hdr === "true") filter.hdr = true;
    if (search) filter.$text = { $search: search };

    const monitors = await MonitorModel.find(filter)
      .sort({ rating: -1 })
      .lean({ virtuals: true });

    return NextResponse.json({ data: monitors, count: monitors.length });
  } catch (err) {
    console.error("[GET /api/monitors]", err);
    return NextResponse.json({ error: "Failed to fetch monitors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const monitor = await MonitorModel.create(body);
    return NextResponse.json({ data: monitor.toJSON() }, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /api/monitors]", err);
    const message = err instanceof Error ? err.message : "Failed to create monitor";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
