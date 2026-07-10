import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MouseModel } from "@/lib/models/Mouse";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const filter: Record<string, unknown> = {};

    // ── Text search ──────────────────────────────────────────────────────────
    const search = searchParams.get("search");
    if (search) filter.$text = { $search: search };

    // ── Handedness ───────────────────────────────────────────────────────────
    const handedness = searchParams.get("handedness");
    if (handedness && handedness !== "all") {
      filter.handedness = { $in: [handedness, "ambidextrous"] };
    }

    // ── Connectivity (matches any element in the array field) ────────────────
    const connectivity = searchParams.get("connectivity");
    if (connectivity && connectivity !== "all") {
      filter["specifications.connectivity"] = connectivity;
    }

    // ── Grip style ───────────────────────────────────────────────────────────
    const gripStyle = searchParams.get("gripStyle");
    if (gripStyle && gripStyle !== "all") {
      filter.gripStyle = gripStyle;
    }

    // ── Weight range (grams) ─────────────────────────────────────────────────
    const minWeight = searchParams.get("minWeight");
    const maxWeight = searchParams.get("maxWeight");
    if (minWeight || maxWeight) {
      const w: Record<string, number> = {};
      if (minWeight) w.$gte = Number(minWeight);
      if (maxWeight) w.$lte = Number(maxWeight);
      filter.weight = w;
    }

    // ── Length range (mm) ────────────────────────────────────────────────────
    const minLength = searchParams.get("minLength");
    const maxLength = searchParams.get("maxLength");
    if (minLength || maxLength) {
      const l: Record<string, number> = {};
      if (minLength) l.$gte = Number(minLength);
      if (maxLength) l.$lte = Number(maxLength);
      filter["dimensions.length"] = l;
    }

    // ── Width range (mm) ─────────────────────────────────────────────────────
    const minWidth = searchParams.get("minWidth");
    const maxWidth = searchParams.get("maxWidth");
    if (minWidth || maxWidth) {
      const w: Record<string, number> = {};
      if (minWidth) w.$gte = Number(minWidth);
      if (maxWidth) w.$lte = Number(maxWidth);
      filter["dimensions.width"] = w;
    }

    // ── Price range ──────────────────────────────────────────────────────────
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      const p: Record<string, number> = {};
      if (minPrice) p.$gte = Number(minPrice);
      if (maxPrice) p.$lte = Number(maxPrice);
      filter.price = p;
    }

    // ── Tags ─────────────────────────────────────────────────────────────────
    const tag = searchParams.get("tag");
    if (tag) filter.tags = tag;

    // ── Sorting ───────────────────────────────────────────────────────────────
    const sort = searchParams.get("sort") ?? "weight";
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      weight:      { weight: 1 },
      "weight-desc": { weight: -1 },
      "price-asc": { price: 1 },
      "price-desc":{ price: -1 },
      length:      { "dimensions.length": 1 },
      newest:      { createdAt: -1 },
    };

    const mice = await MouseModel.find(filter)
      .sort(sortMap[sort] ?? { weight: 1 })
      .lean({ virtuals: true });

    return NextResponse.json({ data: mice, count: mice.length });
  } catch (err) {
    console.error("[GET /api/mice]", err);
    return NextResponse.json({ error: "Failed to fetch mice" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Auto-generate slug if not provided
    if (!body.slug && body.brand && body.model) {
      body.slug = `${body.brand}-${body.model}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const mouse = await MouseModel.create(body);
    return NextResponse.json({ data: mouse.toJSON() }, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /api/mice]", err);
    const message = err instanceof Error ? err.message : "Failed to create mouse";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
