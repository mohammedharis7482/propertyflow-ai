import { CalendarCheck, Home, MessageCircle, Settings } from "lucide-react";
import { DashboardActivity } from "@/types/dashboard";

interface ActivityFeedProps {
  activities: DashboardActivity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const icons = {
    property: Home,
    inquiry: MessageCircle,
    appointment: CalendarCheck,
    system: Settings,
  };

  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-bold">Recent Activity</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest platform updates and actions.
        </p>
      </div>

      <div className="space-y-0">
        {activities.map((activity, index) => {
          const Icon = icons[activity.type];

          return (
            <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
              {index !== activities.length - 1 && (
                <span className="absolute left-5 top-10 h-full w-px bg-border" />
              )}

              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-primary ring-4 ring-white">
                <Icon size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {activity.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {activity.description}
                </p>
                <p className="mt-2 text-xs font-medium text-primary">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}