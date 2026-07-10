import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MouseModel } from "@/lib/models/Mouse";
import mongoose from "mongoose";

/**
 * Resolve a mouse by either:
 *  - MongoDB ObjectId  (24-char hex)
 *  - URL slug          (e.g. "logitech-g-pro-x-superlight-2")
 */
function buildLookup(id: string) {
  return mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const mouse = await MouseModel.findOne(buildLookup(id)).lean({ virtuals: true });
    if (!mouse) return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    return NextResponse.json({ data: mouse });
  } catch (err) {
    console.error("[GET /api/mice/:id]", err);
    return NextResponse.json({ error: "Failed to fetch mouse" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Never allow overwriting the slug via PATCH (use explicit field)
    // unless the caller explicitly sets it
    const mouse = await MouseModel.findOneAndUpdate(
      buildLookup(id),
      { $set: body },
      { new: true, runValidators: true }
    ).lean({ virtuals: true });

    if (!mouse) return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    return NextResponse.json({ data: mouse });
  } catch (err: unknown) {
    console.error("[PATCH /api/mice/:id]", err);
    const message = err instanceof Error ? err.message : "Failed to update mouse";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** Full replacement — use PATCH for partial updates */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const mouse = await MouseModel.findOneAndReplace(
      buildLookup(id),
      body,
      { new: true, runValidators: true, upsert: false }
    ).lean({ virtuals: true });

    if (!mouse) return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    return NextResponse.json({ data: mouse });
  } catch (err: unknown) {
    console.error("[PUT /api/mice/:id]", err);
    const message = err instanceof Error ? err.message : "Failed to replace mouse";
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
    const mouse = await MouseModel.findOneAndDelete(buildLookup(id));
    if (!mouse) return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    return NextResponse.json({ message: "Mouse deleted" });
  } catch (err) {
    console.error("[DELETE /api/mice/:id]", err);
    return NextResponse.json({ error: "Failed to delete mouse" }, { status: 500 });
  }
}
