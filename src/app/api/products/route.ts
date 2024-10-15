import { db } from "@/db";
import { Products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const id = 1;
  const name = `CuteCat-${Math.ceil(Math.random() * 999)}`;
  // If no ID or name is provided, return a bad request response
  if (!id || !name) {
    return NextResponse.json({ error: "Missing id or name" }, { status: 400 });
  }

  try {
    const result = await db.update(Products).set({ name }).where(eq(Products.id, id)).returning();

    return NextResponse.json({ message: "DB updated successfully", name: result[0]?.name });
  } catch (error) {
    console.error("Error updating DB record:", error);
    return NextResponse.json({ error: "Error updating DB record" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const result = await db.select().from(Products);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching DB record:", error);
    return NextResponse.json({ error: "Error fetching DB record" }, { status: 500 });
  }
}
