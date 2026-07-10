import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MouseModel } from "@/lib/models/Mouse";
import { KeyboardModel } from "@/lib/models/Keyboard";
import { MonitorModel } from "@/lib/models/Monitor";
import { mice } from "@/lib/data/mice";
import { keyboards } from "@/lib/data/keyboards";
import { monitors } from "@/lib/data/monitors";

// Only allow seeding in development
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seeding is not allowed in production" },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    // Clear existing data
    await MouseModel.deleteMany({});
    await KeyboardModel.deleteMany({});
    await MonitorModel.deleteMany({});

    // Mice: seed data already matches the new schema (no id/createdAt/updatedAt)
    const insertedMice = await MouseModel.insertMany(mice);

    // Keyboards / monitors: strip legacy 'id' field before inserting
    const keyboardsToInsert = keyboards.map(({ id: _id, ...rest }) => rest);
    const monitorsToInsert  = monitors.map(({ id: _id, ...rest }) => rest);

    const insertedKeyboards = await KeyboardModel.insertMany(keyboardsToInsert);
    const insertedMonitors  = await MonitorModel.insertMany(monitorsToInsert);

    return NextResponse.json({
      message: "Database seeded successfully",
      counts: {
        mice:      insertedMice.length,
        keyboards: insertedKeyboards.length,
        monitors:  insertedMonitors.length,
      },
    });
  } catch (err) {
    console.error("[POST /api/seed]", err);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
