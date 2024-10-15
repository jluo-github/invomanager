"use client";

import { statusData } from "@/app/invoices/[id]/Invoice";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  status: string;
}

const StatusBadge = ({
  invoice,
  otherClassName,
}: {
  invoice: Invoice;
  otherClassName: string;
}) => {
  const statusColor = statusData.find((s) => s.name === invoice.status)?.color;
  return (
    <Badge
      className={`rounded-3xl ${statusColor} hover:${statusColor} hover:bg-opacity-80 ${otherClassName}`}>
      {invoice.status}
    </Badge>
  );
};
export default StatusBadge;
