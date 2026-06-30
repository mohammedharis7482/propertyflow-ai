import Link from "next/link";
import { DashboardInquiry } from "@/types/dashboard";
import { Button } from "@/components/ui/button";

interface ApprovalTableProps {
  approvals: DashboardInquiry[];
}

export default function ApprovalTable({
  approvals,
}: ApprovalTableProps) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold">
            Pending Approvals
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Agents and property submissions awaiting review.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/inquiries">View All</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {approvals.map((approval) => (
          <div
            key={approval.id}
            className="flex flex-col gap-4 rounded-2xl border border-border p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold text-foreground">
                {approval.name}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {approval.property}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {approval.status}
              </span>

              <p className="text-xs text-muted-foreground">
                {approval.time}
              </p>

              <Button size="sm" variant="outline" className="rounded-xl bg-white" asChild>
                <Link href="/dashboard/admin/inquiries">Review</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
