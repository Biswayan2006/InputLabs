import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { KeyboardModel } from "@/lib/models/Keyboard";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const filter: Record<string, unknown> = {};
    const size = searchParams.get("size");
    const connectivity = searchParams.get("connectivity");
    const maxPrice = searchParams.get("maxPrice");
    const hotswap = searchParams.get("hotswap");
    const gasket = searchParams.get("gasket");
    const search = searchParams.get("search");

    if (size && size !== "all") filter.size = size;
    if (connectivity && connectivity !== "all") filter.connectivity = connectivity;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (hotswap === "true") filter.hotswap = true;
    if (gasket === "true") filter.gasket = true;
    if (search) filter.$text = { $search: search };

    const keyboards = await KeyboardModel.find(filter)
      .sort({ rating: -1 })
      .lean({ virtuals: true });

    return NextResponse.json({ data: keyboards, count: keyboards.length });
  } catch (err) {
    console.error("[GET /api/keyboards]", err);
    return NextResponse.json({ error: "Failed to fetch keyboards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const keyboard = await KeyboardModel.create(body);
    return NextResponse.json({ data: keyboard.toJSON() }, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /api/keyboards]", err);
    const message = err instanceof Error ? err.message : "Failed to create keyboard";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
