/**
 * Skeleton loading laporan (DESIGN.md §7). Server Component ringan.
 */
export default function ReportsLoading() {
  return (
    <div
      aria-label="Memuat laporan"
      aria-busy="true"
      className="mx-auto flex min-h-screen w-full max-w-[430px] animate-pulse flex-col bg-background"
    >
      <div className="bg-header px-5 pt-6 pb-12">
        <div className="h-6 w-48 rounded bg-on-header/30" />
        <div className="mt-3 h-11 rounded-md bg-on-header/20" />
      </div>
      <div className="mx-[18px] -mt-6 flex justify-center">
        <div className="h-11 w-52 rounded bg-surface" />
      </div>
      <div className="mx-[18px] mt-3 flex items-center gap-4 rounded-md bg-muted px-4 py-5">
        <div className="h-[150px] w-[150px] shrink-0 rounded-full bg-ink/10" />
        <div className="h-20 flex-1 rounded bg-ink/10" />
      </div>
      <div className="mt-4 flex-1 rounded-t-[32px] bg-surface px-[18px] pt-5">
        <div className="h-6 w-32 rounded bg-ink/10" />
      </div>
    </div>
  );
}
