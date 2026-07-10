import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MonitorModel } from "@/lib/models/Monitor";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const monitor = await MonitorModel.findById(id).lean({ virtuals: true });
    if (!monitor) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    return NextResponse.json({ data: monitor });
  } catch (err) {
    console.error("[GET /api/monitors/:id]", err);
    return NextResponse.json({ error: "Failed to fetch monitor" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const monitor = await MonitorModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean({ virtuals: true });
    if (!monitor) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    return NextResponse.json({ data: monitor });
  } catch (err: unknown) {
    console.error("[PUT /api/monitors/:id]", err);
    const message = err instanceof Error ? err.message : "Failed to update monitor";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const monitor = await MonitorModel.findByIdAndDelete(id);
    if (!monitor) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    return NextResponse.json({ message: "Monitor deleted successfully" });
  } catch (err) {
    console.error("[DELETE /api/monitors/:id]", err);
    return NextResponse.json({ error: "Failed to delete monitor" }, { status: 500 });
  }
}
