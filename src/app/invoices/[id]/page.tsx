import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { notFound } from "next/navigation";
import { toast } from "sonner";

import Invoice from "@/app/invoices/[id]/Invoice";

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
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.id, Number(id)), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) {
    return <p className='my-8'>No invoice found.</p>;
  }

  const invoices = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice result={invoices} id={id} />;
};

export default SingleInvoice;
