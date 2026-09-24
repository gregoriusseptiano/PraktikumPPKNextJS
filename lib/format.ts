// Helper format Rupiah (DESIGN §9).
// Contoh format saja, bukan data pengguna.
// rupiah(1781273) -> "Rp 1.781.273"
// rupiah(-100000, { prefix: false, sign: true }) -> "- 100.000"

export function rupiah(
  n: number,
  opts: { prefix?: boolean; sign?: boolean } = {}
): string {
  const { prefix = true, sign = false } = opts;
  const abs = Math.abs(n).toLocaleString("id-ID");
  const s = sign ? (n < 0 ? "- " : n > 0 ? "+ " : "") : "";
  return `${s}${prefix ? "Rp " : ""}${abs}`;
}
