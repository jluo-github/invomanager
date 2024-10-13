import { db } from "@/db";
import { Invoices } from "@/db/schema";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { notFound } from "next/navigation";
import { toast } from "sonner";

import Invoice from "@/components/Invoice";

type Props = {
  params: {
    id: string;
  };
};

const SingleInvoice = async ({ params }: Props) => {
  const { id } = params;
  const { userId } = auth();

  if (!userId) {
    toast.error("Unauthorized");
    return;
  }

  if (isNaN(+id)) {
    throw new Error("Invalid Invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, Number(id)), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) {
    notFound();
  }

  return <Invoice result={result} id={id} />;
};
export default SingleInvoice;
