"use server";
import { db } from "@/db";
import { Customers, Invoices, Products, type Status } from "@/db/schema";
import InvoiceCreatedEmail from "@/emails/invoice-created";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import process from "process";
import { Resend } from "resend";
import Stripe from "stripe";

// resend
const resend = new Resend(process.env.RESEND_API_KEY);

// stripe
const stripe = new Stripe(process.env.STRIPE_API_SECRET!);

// create invoice
export async function createInvoice(formData: FormData) {
  // todo - remove this
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const value = Math.floor(parseFloat(formData.get("value") as string) * 100);
  // console.log("value", value);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  // create customer
  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
    })
    .returning({
      id: Customers.id,
    });

  // create invoice
  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      status: "open",

      customerId: customer.id,
    })
    .returning({
      id: Invoices.id,
    });
  console.log("results", results);

  // send email
  // await resend.emails.send({
  //   from: `InvoManager <${process.env.FROM_EMAIL}>`,
  //   to: [email],
  //   subject: "You Have a New Invoice",
  //   react: InvoiceCreatedEmail({ invoiceId: results[0].id }),
  // });
  // send email
  await resend.batch.send([
    {
      from: `InvoManager <${process.env.FROM_EMAIL}>`,
      to: [email],
      subject: "You Have a New Invoice",
      react: InvoiceCreatedEmail({ invoiceId: results[0].id }),
    },
    {
      from: `InvoManager <${process.env.FROM_EMAIL}>`,
      to: [process.env.MY_EMAIL!],
      subject: "Copy of the New Invoice",
      react: InvoiceCreatedEmail({ invoiceId: results[0].id }),
    },
  ]);

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatus(formData: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const id = parseInt(formData.get("id") as string);
  const statusName = formData.get("status") as Status;

  await db
    .update(Invoices)
    .set({ status: statusName })
    .where(and(eq(Invoices.id, id), eq(Invoices.userId, userId)));

  revalidatePath(`/invoices/${id}`);
}

export async function deleteInvoice(formData: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const id = parseInt(formData.get("id") as string);

  await db.delete(Invoices).where(and(eq(Invoices.id, id), eq(Invoices.userId, userId)));

  revalidatePath(`/dashboard`);
  redirect(`/dashboard`);
}

//
export async function createPayment(formData: FormData) {
  // stripe
  const headersList = headers();
  const origin = headersList.get("origin");
  console.log("origin", origin);

  const id = parseInt(formData.get("id") as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  if (!result) {
    throw new Error("Invoice not found");
  }

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell

        price_data: {
          currency: "usd",
          product: "prod_R1xuszmXqS4dz2",
          unit_amount: result.value,
        },

        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  // stipe session url
  if (!session.url) {
    throw new Error("Session URL not found");
  }

  redirect(session.url);
}

// createProduct
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;

  const [product] = await db
    .insert(Products)
    .values({
      name,
    })
    .returning({
      id: Products.id,
    });

  revalidatePath("/products");
}
