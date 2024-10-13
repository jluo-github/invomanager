import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

const DashboardPage = async () => {
  const { userId } = auth();
  if (!userId) {
    toast.error("Unauthorized");
    return;
  }
  const results = await db.select().from(Invoices).where(eq(Invoices.userId, userId));

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
          {results.map((invoice) => (
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
                  invoice.name
                </Link>
              </TableCell>
              <TableCell className='text-left p-0'>
                <Link href={`/invoices/${invoice.id}`} className='py-3 block'>
                  invoice.email
                </Link>
              </TableCell>
              <TableCell className='text-center p-0'>
                <Link
                  href={`/invoices/${invoice.id}`}
                  className='font-semibold py-3 block'>
                  <Badge className='text-xs md:text-base rounded-3xl'>
                    {invoice.status}
                  </Badge>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default DashboardPage;
