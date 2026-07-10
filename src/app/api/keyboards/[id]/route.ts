import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { KeyboardModel } from "@/lib/models/Keyboard";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const keyboard = await KeyboardModel.findById(id).lean({ virtuals: true });
    if (!keyboard) return NextResponse.json({ error: "Keyboard not found" }, { status: 404 });
    return NextResponse.json({ data: keyboard });
  } catch (err) {
    console.error("[GET /api/keyboards/:id]", err);
    return NextResponse.json({ error: "Failed to fetch keyboard" }, { status: 500 });
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
    const keyboard = await KeyboardModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean({ virtuals: true });
    if (!keyboard) return NextResponse.json({ error: "Keyboard not found" }, { status: 404 });
    return NextResponse.json({ data: keyboard });
  } catch (err: unknown) {
    console.error("[PUT /api/keyboards/:id]", err);
    const message = err instanceof Error ? err.message : "Failed to update keyboard";
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
    const keyboard = await KeyboardModel.findByIdAndDelete(id);
    if (!keyboard) return NextResponse.json({ error: "Keyboard not found" }, { status: 404 });
    return NextResponse.json({ message: "Keyboard deleted successfully" });
  } catch (err) {
    console.error("[DELETE /api/keyboards/:id]", err);
    return NextResponse.json({ error: "Failed to delete keyboard" }, { status: 500 });
  }
}
