import { createPayment, updateStatus } from "@/app/actions";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { BadgeAlert, Check, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { Stripe } from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_SECRET!);

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    status: string;
    session_id: string;
  };
};

const PaymentPage = async ({ params, searchParams }: Props) => {
  const { id } = params;
  const sessionId = searchParams.session_id;
  const isSuccess = sessionId && searchParams.status === "success";
  const isCanceled = searchParams.status === "canceled";

  let isError = !sessionId && isSuccess;

  const { userId } = auth();
  if (!userId) {
    toast.error("Unauthorized");
    return;
  }

  if (isNaN(+id)) {
    throw new Error("Invalid Invoice ID");
  }

  if (isSuccess) {
    // stripe session id
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // console.log("session :>> ", session);
    const { payment_status } = session;

    if (payment_status !== "paid") {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append("id", String(id));
      formData.append("status", "paid");
      await updateStatus(formData);
    }
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      crateTs: Invoices.crateTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.id, Number(id)), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: { name: result.name },
  };

  return (
    <div className='flex flex-col gap-12 my-8'>
      {isError && (
        <p className='bg-red-100 text-red-600 w-full p-1 rounded text-center'>
          Payment failed, please try again.{" "}
        </p>
      )}
      {isCanceled && (
        <p className='bg-blue-100 text-blue-600 w-full p-1 rounded text-center'>
          Payment was cancelled.
        </p>
      )}
      {/* heading */}
      <div className='flex items-center justify-center mb-12'>
        {" "}
        <h1 className='text-3xl font-semibold '>Payment page</h1>
      </div>

      <div className='grid grid-cols-1 gap-12 md:grid-cols-2'>
        {/* invoice */}
        <div className='flex flex-col gap-4 items-start  '>
          <h1 className='text-2xl font-semibold flex items-center gap-4'>
            Invoice details
            <StatusBadge otherClassName='text-xs' invoice={invoice} />
          </h1>
          <ul className='grid gap-2'>
            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Invoice ID:
              </strong>
              <span>{invoice.id}</span>
            </li>
            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Invoice Date:
              </strong>
              <span>
                {" "}
                {invoice.crateTs ? new Date(invoice.crateTs).toLocaleDateString() : "N/A"}
              </span>
            </li>
            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Customer Name:
              </strong>
              <span>{invoice.customer.name}</span>
            </li>

            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Description:
              </strong>
              <span>{invoice.description}</span>
            </li>
            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Value:
              </strong>
              <span>${(invoice.value / 100).toFixed(2)}</span>
            </li>
          </ul>
          <div className='my-8'></div>
        </div>

        {/* payment */}
        <div className='flex flex-col items-start'>
          <h1 className='text-2xl font-semibold flex mb-12'>Manage Invoice</h1>

          {invoice.status === "open" && (
            <form action={createPayment}>
              <input type='hidden' name='id' value={id} />
              <Button size='lg'>
                <CreditCard className='w-5 h-5 mr-2' />
                Pay Invoice
              </Button>
            </form>
          )}

          {invoice.status === "paid" && (
            <p className='flex gap-3 items-center text-xl '>
              <Check className='w-6 h-6 bg-green-500 rounded-full text-white p-1' />
              Invoice paid, thank you!
            </p>
          )}

          {(invoice.status === "void" || invoice.status === "hold") && (
            <p className='flex gap-3 items-center text-xl '>
              <BadgeAlert className='w-6 h-6 bg-red-500 rounded-full text-white p-1' />
              {invoice.status === "hold" ? "Invoice on hold" : "Invoice voided"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
