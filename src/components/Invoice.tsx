"use client";
import { useOptimistic } from "react";
import { updateStatus } from "@/app/actions";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Invoices, type Status } from "@/db/schema";
import { Pencil } from "lucide-react";

export const statusData = [
  { name: "open", color: "bg-violet-500" },
  { name: "paid", color: "bg-green-500" },
  { name: "void", color: "bg-gray-500" },
  { name: "hold", color: "bg-red-500" },
];

const Invoice = ({
  result,
  id,
}: {
  result: typeof Invoices.$inferInsert;
  id: string;
}) => {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    result.status,
    (state, newStatus) => {
      return newStatus as Status;
    }
  );

  async function handleUpdate(status: Status) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    await updateStatus(formData);
    setCurrentStatus(status);
  }

  return (
    <div className='flex flex-col gap-12 my-8'>
      {/* heading */}
      <div className='flex items-center justify-between'>
        {" "}
        <h1 className='text-3xl font-semibold flex items-center gap-4'>
          Invoice #{id}{" "}
          <Badge
            className={cn(
              "rounded-full capitalize",
              statusData.find((s) => s.name === result.status)?.color || "bg-gray-500"
            )}>
            {result.status}
          </Badge>
        </h1>
        {/* dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className=' mx-auto'>
              Change Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statusData.map((s) => (
              <DropdownMenuItem key={s.name} asChild>
                <form action={updateStatus}>
                  <input type='hidden' name='id' value={id} />
                  <input type='hidden' name='status' value={s.name} />
                  <button className='w-full'>
                    <DropdownMenuLabel>{s.name}</DropdownMenuLabel>
                  </button>
                </form>
              </DropdownMenuItem>
            ))}{" "}
          </DropdownMenuContent>
        </DropdownMenu>
        {/*update button */}
        <Button variant='outline' asChild>
          <Link href={`/invoices/${id}/update`}>
            <Pencil className='mr-2 h-4 w-4' />
            Update Invoice
          </Link>
        </Button>
      </div>

      {/* invoice */}

      <div className='flex flex-col gap-4 items-center mx-auto'>
        <div className=''>
          <h2 className='text-2xl font-semibold'>Invoice Details</h2>
        </div>
        <div className=''>userId {result.userId}</div>
        <div className=''>value {result.value}</div>
        <div className=''>description {result.description}</div>
      </div>
    </div>
  );
};
export default Invoice;
