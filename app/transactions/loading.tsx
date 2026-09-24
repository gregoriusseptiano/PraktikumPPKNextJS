export default function TransactionsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Memuat riwayat transaksi"
      className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12"
    >
      <div className="h-4 w-16 animate-pulse rounded bg-ink/10" />
      <div className="mt-3 h-8 w-56 animate-pulse rounded-md bg-ink/10" />

      <div className="mt-6 flex flex-wrap gap-2">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-11 w-24 animate-pulse rounded-full bg-ink/10"
          />
        ))}
      </div>

      <div className="mt-4 space-y-1">
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse border-b border-line bg-ink/5"
          />
        ))}
      </div>
    </main>
  );
}
