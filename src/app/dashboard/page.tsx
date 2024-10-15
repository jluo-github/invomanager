import MyPagination from "@/components/MyPagination";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { count, eq } from "drizzle-orm";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export const PER_PAGE = 10;

const DashboardPage = async ({ searchParams }: { searchParams: { page: string } }) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const offset = PER_PAGE * (currentPage - 1);

  const { userId } = auth();
  if (!userId) {
    return <p className='my-8'>Unauthorized.</p>;
  }

  // fetch invoices
  const results = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.userId, userId))
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .limit(PER_PAGE)
    .offset(offset);

  if (!results || results.length === 0) {
    return <p className='my-8'>No invoices found.</p>;
  }

  // fetch total invoices count
  const invoiceCounts: { total: number }[] = await db
    .select({ total: count() })
    .from(Invoices)
    .where(eq(Invoices.userId, userId))
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id));

  const { total } = invoiceCounts[0];
  const totalPages = Math.ceil(total / PER_PAGE);

  const invoices = results.map(({ invoices, customers }) => {
    return { ...invoices, customer: customers };
  });

  return (
    <div className='flex flex-col gap-12 my-8'>
      {/* heading */}
      <div className='flex items-center justify-between'>
        {" "}
        <h1 className='text-3xl font-semibold'>Invoices</h1>
        {/* button */}
        <Button variant='outline' asChild>
          <Link href='/invoices/new'>
            <CirclePlus className='mr-2 h-4 w-4' />
            Create Invoice
          </Link>
        </Button>
      </div>

      {/* table */}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>

        {/* table header */}
        <TableHeader>
          <TableRow className='text-xs md:text-base'>
            <TableHead className='w-[100px] md:w-[120px] py-3 px-1'>Date</TableHead>
            <TableHead className='py-3 px-1'>Customer</TableHead>
            <TableHead className='py-3 px-1'>Email</TableHead>
            <TableHead className='w-[70px] md:w-[80px] text-center py-3 px-1'>
              Status
            </TableHead>
            <TableHead className='text-right py-3 px-1'>Value</TableHead>
          </TableRow>
        </TableHeader>

        {/* table body */}
        <TableBody>
          {invoices.map((invoice) => {
            return (
              <TableRow key={invoice.id} className='text-xs md:text-base'>
                <TableCell className='text-left p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-3 block'>
                    {new Date(invoice.crateTs).toLocaleDateString()}
                  </Link>{" "}
                </TableCell>
                <TableCell className='text-left p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-3 block'>
                    {invoice.customer.name}
                  </Link>
                </TableCell>
                <TableCell className='text-left p-0'>
                  <Link href={`/invoices/${invoice.id}`} className='py-3 block'>
                    {invoice.customer.email}
                  </Link>
                </TableCell>
                <TableCell className='text-center p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-3 block'>
                    <StatusBadge otherClassName='text-xs md:text-sm' invoice={invoice} />
                  </Link>
                </TableCell>
                <TableCell className='text-right p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-3 block'>
                    {" "}
                    ${(invoice.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* pagination */}
      <MyPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};
export default DashboardPage;
