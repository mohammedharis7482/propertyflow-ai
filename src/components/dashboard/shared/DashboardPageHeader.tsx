interface DashboardPageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
}

export default function DashboardPageHeader({
  badge,
  title,
  description,
}: DashboardPageHeaderProps) {
  return (
    <div className="mb-6 rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:mb-8 sm:rounded-[2rem] sm:p-7">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          {badge && (
            <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-primary sm:text-sm">
              {badge}
            </div>
          )}

          <h1 className="max-w-3xl font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="w-full rounded-2xl bg-[#F8FAF9] px-5 py-4 sm:w-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Today’s AI Signal
          </p>
          <p className="mt-1 font-heading text-lg font-bold text-primary">
            3 new opportunities
          </p>
        </div>
      </div>
    </div>
  );
}
