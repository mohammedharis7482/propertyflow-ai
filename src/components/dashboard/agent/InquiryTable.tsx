import Link from "next/link";
import { DashboardInquiry } from "@/types/dashboard";
import { Button } from "@/components/ui/button";

interface InquiryTableProps {
  inquiries: DashboardInquiry[];
}

export default function InquiryTable({ inquiries }: InquiryTableProps) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold">Recent Inquiries</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest buyer and tenant leads.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/dashboard/agent/inquiries">View All</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        {inquiries.map((inquiry, index) => (
          <div
            key={inquiry.id}
            className="grid gap-3 border-b border-border p-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <p className="font-semibold text-foreground">{inquiry.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {inquiry.time}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">
                {inquiry.property}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Lead #{index + 1}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                {inquiry.status}
              </span>
              <Button size="sm" variant="outline" className="rounded-xl bg-white" asChild>
                <Link href="/dashboard/agent/inquiries">Open</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
