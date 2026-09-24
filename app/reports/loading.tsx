export default function ReportsLoading() {
  return (
    <div
      aria-label="Memuat laporan"
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

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Back button skeleton */}
        <div className="h-5 w-40 rounded bg-ink/10" />

        {/* Header Controls Card Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-divider bg-surface p-6 shadow-sm">
          <div className="space-y-2">
            <div className="h-8 w-56 rounded bg-ink/10" />
            <div className="h-4 w-72 rounded bg-ink/10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-44 rounded-xl bg-ink/10" />
            <div className="h-10 w-48 rounded-xl bg-ink/10" />
          </div>
        </div>

        {/* 2 Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-28 rounded-xl border border-divider bg-surface p-5 shadow-sm" />
          <div className="h-28 rounded-xl border border-divider bg-surface p-5 shadow-sm" />
        </div>

        {/* 2-Column Grid: Pie Chart (5 cols) & Transaction List (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 rounded-2xl border border-divider bg-surface p-6 shadow-sm space-y-6">
            <div className="h-5 w-48 rounded bg-ink/10 border-b border-divider pb-3" />
            <div className="mx-auto h-44 w-44 rounded-full bg-ink/10" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div className="h-4 w-28 rounded bg-ink/10" />
                  <div className="h-4 w-20 rounded bg-ink/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-divider bg-surface p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-divider pb-3">
              <div className="h-5 w-44 rounded bg-ink/10" />
              <div className="h-4 w-20 rounded bg-ink/10" />
            </div>
            <div className="divide-y divide-divider">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 py-4">
                  <div className="h-9 w-9 rounded bg-ink/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 rounded bg-ink/10" />
                    <div className="h-3 w-24 rounded bg-ink/10" />
                  </div>
                  <div className="h-5 w-24 rounded bg-ink/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
