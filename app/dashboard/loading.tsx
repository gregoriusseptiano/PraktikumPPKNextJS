/**
 * Skeleton loading dashboard (DESIGN.md §7: skeleton, pertahankan
 * header biru). Server Component ringan, tanpa data asli.
 */
export default function DashboardLoading() {
  return (
    <div
      aria-label="Memuat beranda"
      aria-busy="true"
      className="mx-auto flex min-h-screen w-full max-w-[430px] animate-pulse flex-col bg-background"
    >
      <div className="bg-header px-5 pt-6 pb-10">
        <div className="h-4 w-24 rounded bg-on-header/30" />
        <div className="mt-2 h-3 w-32 rounded bg-on-header/30" />
        <div className="mt-2 h-7 w-48 rounded bg-on-header/30" />
      </div>
      <div className="mx-[18px] -mt-6 flex gap-2">
        <div className="h-[76px] flex-1 rounded-md bg-surface" />
        <div className="h-[76px] flex-1 rounded-md bg-surface" />
      </div>
      <div className="mt-4 flex-1 rounded-t-[32px] bg-surface px-[18px] pt-5">
        <div className="h-6 w-44 rounded bg-ink/10" />
        <ul>
          {[0, 1, 2].map((row) => (
            <li
              key={row}
              className="flex items-center gap-3 border-b border-divider py-4"
            >
              <div className="h-9 w-9 rounded bg-ink/10" />
              <div className="h-4 flex-1 rounded bg-ink/10" />
              <div className="h-4 w-20 rounded bg-ink/10" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
