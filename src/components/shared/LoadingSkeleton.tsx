interface LoadingSkeletonProps {
  variant?: "public" | "dashboard";
}

export default function LoadingSkeleton({
  variant = "public",
}: LoadingSkeletonProps) {
  if (variant === "dashboard") {
    return (
      <div className="min-h-screen bg-[#F6F8F7] p-5 lg:p-8">
        <div className="mx-auto w-full max-w-[1440px] space-y-6">
          <div className="h-40 animate-pulse rounded-[2rem] border border-border bg-white shadow-sm" />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-[2rem] border border-border bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
            <div className="h-[460px] animate-pulse rounded-[2rem] border border-border bg-white shadow-sm" />
            <div className="space-y-6">
              <div className="h-72 animate-pulse rounded-[2rem] bg-emerald-100" />
              <div className="h-72 animate-pulse rounded-[2rem] border border-border bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff,#f8fafc)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="h-16 animate-pulse rounded-2xl border border-border bg-white shadow-sm" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div className="space-y-5">
            <div className="h-10 w-44 animate-pulse rounded-full bg-emerald-100" />
            <div className="h-16 animate-pulse rounded-2xl bg-slate-100 sm:h-24" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-12 animate-pulse rounded-full bg-emerald-100" />
              <div className="h-12 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="h-[360px] animate-pulse rounded-[2rem] bg-slate-100 shadow-sm" />
        </div>
      </div>
    </div>
  );
}
