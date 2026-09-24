/**
 * Skeleton loading dashboard (DESIGN.md §7: state loading).
 * Server Component ringan, tanpa data asli.
 */
export default function DashboardLoading() {
  return (
    <main
      aria-label="Memuat dashboard"
      aria-busy="true"
      className="mx-auto flex w-full max-w-2xl animate-pulse flex-col gap-6 bg-paper px-5 py-8"
    >
      <div>
        <div className="h-4 w-20 rounded bg-ink/10" />
        <div className="mt-2 h-8 w-44 rounded bg-ink/10" />
      </div>
      <div className="rounded-[10px] bg-ink/5 px-5 py-6">
        <div className="h-4 w-28 rounded bg-ink/10" />
        <div className="mt-2 h-10 w-56 rounded bg-ink/10" />
        <div className="mt-4 h-11 w-40 rounded-lg bg-ink/10" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-24 rounded-[10px] bg-ink/5" />
        <div className="h-24 rounded-[10px] bg-ink/5" />
      </div>
      <div className="h-6 w-44 rounded bg-ink/10" />
      <ul>
        {[0, 1, 2].map((row) => (
          <li
            key={row}
            className="flex items-center justify-between gap-3 border-b border-ink/10 py-3"
          >
            <div className="h-4 w-32 rounded bg-ink/10" />
            <div className="h-4 w-24 rounded bg-ink/10" />
          </li>
        ))}
      </ul>
    </main>
  );
}
