export default function DashboardLoading() {
  return (
    <div
      aria-label="Memuat beranda"
      aria-busy="true"
      className="min-h-screen bg-background animate-pulse"
    >
      {/* Top Navbar Skeleton */}
      <div className="border-b border-divider bg-surface px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-ink/10" />
            <div className="h-6 w-28 rounded bg-ink/10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-32 rounded-lg bg-ink/10" />
            <div className="h-8 w-8 rounded-full bg-ink/10" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Banner Skeleton */}
        <div className="h-44 w-full rounded-2xl bg-ink/10" />

        {/* 3 Metric Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex h-36 flex-col justify-between rounded-xl border border-divider bg-surface p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 rounded bg-ink/10" />
                <div className="h-10 w-10 rounded-lg bg-ink/10" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-44 rounded bg-ink/10" />
                <div className="h-3 w-36 rounded bg-ink/10" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Main Grid: Recent Transactions & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-xl border border-divider bg-surface p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-divider pb-4">
              <div className="h-6 w-44 rounded bg-ink/10" />
              <div className="h-4 w-20 rounded bg-ink/10" />
            </div>
            <div className="divide-y divide-divider">
              {[0, 1, 2, 3, 4].map((row) => (
                <div key={row} className="flex items-center gap-3.5 py-4">
                  <div className="h-10 w-10 rounded-lg bg-ink/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 rounded bg-ink/10" />
                    <div className="h-3 w-24 rounded bg-ink/10" />
                  </div>
                  <div className="h-5 w-24 rounded bg-ink/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-divider bg-surface p-6 shadow-sm space-y-4">
              <div className="h-5 w-44 rounded bg-ink/10 border-b border-divider pb-4" />
              <div className="space-y-3">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-lg border border-divider">
                    <div className="h-12 w-12 rounded-full bg-ink/10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-28 rounded bg-ink/10" />
                      <div className="h-3 w-20 rounded bg-ink/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
