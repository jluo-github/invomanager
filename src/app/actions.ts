"use server";
import { db } from "@/db";
import { Invoices, type Status } from "@/db/schema";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { statusData } from "@/app/invoices/[id]/page";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createInvoice(formData: FormData) {
  // todo - remove this
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { userId } = auth();
  const value = Math.floor(parseFloat(formData.get("value") as string) * 100);
  // console.log("value", value);
  const description = formData.get("description") as string;

  if (!userId) throw new Error("Unauthorized");

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatus(formData: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const id = parseInt(formData.get("id") as string);
  const statusName = formData.get("status") as Status;

  const results = await db
    .update(Invoices)
    .set({ status: statusName })
    .where(and(eq(Invoices.id, id), eq(Invoices.userId, userId)));

  revalidatePath(`/invoices/${id}`);
}
