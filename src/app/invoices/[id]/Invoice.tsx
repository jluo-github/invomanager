"use client";
import { deleteInvoice, updateStatus } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customers, Invoices } from "@/db/schema";
import { BadgeDollarSign, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import html2pdf from "html2pdf.js";

export const statusData = [
  { name: "open", color: "bg-violet-500" },
  { name: "paid", color: "bg-green-500" },
  { name: "void", color: "bg-gray-400" },
  { name: "hold", color: "bg-red-500" },
];

const Invoice = ({
  result,
  id,
}: {
  result: typeof Invoices.$inferInsert & { customer: typeof Customers.$inferSelect };
  id: string;
}) => {
  const statusColor =
    statusData.find((s) => s.name === result.status)?.color || "bg-gray-500";

  // download pdf
  async function handleClick() {
    const element = document.getElementById("invoice");
    html2pdf(element, {
      margin: 20,
      filename: `invoice-${id}`,
      html2canvas: { scale: 2 },
    }).save();
  }

  return (
    <div id='invoice' className='flex flex-col gap-12 my-8 '>
      {/* heading */}
      <div className='flex items-center md:justify-between flex-col md:flex-row '>
        {" "}
        <h1 className='text-2xl mb-4 font-semibold md:text-3xl flex items-center gap-4'>
          Invoice details
          <Badge
            className={`text-xs rounded-3xl ${statusColor} hover:${statusColor} hover:bg-opacity-80`}>
            {result.status}
          </Badge>
        </h1>
        <div className='flex gap-4 mb-12 md:mb-8' data-html2canvas-ignore>
          {/* dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className=' mx-auto'>
                Change Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-0'>
              {statusData.map((s) => (
                <DropdownMenuItem key={s.name} asChild>
                  <form action={updateStatus}>
                    <input type='hidden' name='id' value={id} />
                    <input type='hidden' name='status' value={s.name} />
                    <button className='w-full'>{s.name}</button>
                  </form>
                </DropdownMenuItem>
              ))}{" "}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* delete dialog */}
          <Dialog>
            {/* delete menu */}
            <DropdownMenu>
              {/* dropdown trigger */}
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className=' mx-auto'>
                  <span className=' '>More Options</span>
                </Button>
              </DropdownMenuTrigger>
              {/* dialog trigger */}
              <DropdownMenuContent className='p-0'>
                {/* delete */}
                <DropdownMenuItem>
                  {/* dialog trigger */}
                  <DialogTrigger asChild>
                    <button className='w-full flex gap-4 items-center justify-start'>
                      <Trash2 className='w-6 h-6' /> Delete
                    </button>
                  </DialogTrigger>
                </DropdownMenuItem>
                {/* pay */}
                <DropdownMenuItem>
                  <Link
                    href={`/invoices/${id}/payment`}
                    className='w-full flex gap-4 items-center justify-start'>
                    <BadgeDollarSign className='w-6 h-6' /> Pay
                  </Link>
                </DropdownMenuItem>
                {/* pdf */}
                <DropdownMenuItem>
                  <button
                    className='w-full flex gap-4 items-center justify-start text-xs'
                    onClick={handleClick}>
                    <Download className='w-6 h-6' />
                    Download PDF
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader className='gap-4'>
                <DialogTitle>Delete Invoice?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete this invoice
                  and remove the data from our servers.
                </DialogDescription>
                <DialogFooter>
                  <form action={deleteInvoice}>
                    <input type='hidden' name='id' value={id} />
                    <Button
                      variant='destructive'
                      className='w-full flex gap-4 items-center justify-center'>
                      <Trash2 className='w-6 h-6' /> Delete
                    </Button>
                  </form>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* invoice */}

      <div className='flex flex-col gap-4 items-start  '>
        <ul className='grid gap-2'>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Invoice ID:
            </strong>
            <span>{result.id}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Invoice Date:
            </strong>
            <span>
              {" "}
              {result.crateTs ? new Date(result.crateTs).toLocaleDateString() : "N/A"}
            </span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Customer Name:
            </strong>
            <span>{result.customer.name}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Billing Email:
            </strong>
            <span>{result.customer.email}</span>
          </li>

          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Description:
            </strong>
            <span>{result.description}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Value:
            </strong>
            <span>${(result.value / 100).toFixed(2)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Invoice;
