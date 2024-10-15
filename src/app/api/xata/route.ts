import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const id = 1;
  const description = `CuteCat-${Math.ceil(Math.random() * 999)}`;

  try {
    const result = await db
      .update(Invoices)
      .set({ description })
      .where(eq(Invoices.id, id));

    return NextResponse.json({ message: "DB updated successfully", result });
  } catch (error) {
    console.error("Error updating DB record:", error);
    return NextResponse.json({ error: "Error updating DB record" }, { status: 500 });
  }
}
