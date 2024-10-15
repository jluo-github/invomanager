import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, res: NextResponse) {
  const id = 1;
  const description = `CuteCat-${Math.ceil(Math.random() * 999)}`;
  const userId = "user_2ijHzZJKwzhbxR7qsaArpNeJ";
  try {
    const result = await db
      .update(Invoices)
      .set({ description })
      .where(and(eq(Invoices.id, id), eq(Invoices.userId, userId)));

    return NextResponse.json({ message: "DB updated successfully", result });
  } catch (error) {
    console.error("Error updating DB record:", error);
    return NextResponse.json({ error: "Error updating DB record" }, { status: 500 });
  }
}
