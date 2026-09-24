import {
  Banknote,
  Car,
  Clapperboard,
  Coffee,
  Scissors,
  Shirt,
  ShoppingBasket,
  Tag,
  Utensils,
} from "lucide-react";

/**
 * Ikon tile kategori Lucide (DESIGN.md §5: outline, stroke 2, sudut
 * membulat). Pencocokan case-insensitive per kata kunci; tiap cabang
 * dirender sebagai komponen statis (bukan variabel) agar tidak
 * me-reset state saat render. Relevansi tiap ikon dicatat di cabang
 * masing-masing (R-04).
 */
function matches(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

export function CategoryIcon({
  category,
  size = 18,
}: {
  category: string;
  size?: number;
}) {
  const lower = category.toLowerCase();
  const props = { size, strokeWidth: 2 } as const;
  if (matches(lower, ["hiburan", "nonton", "film", "game", "musik"])) {
    return <Clapperboard {...props} />; // tontonan dan hiburan
  }
  if (matches(lower, ["kopi", "ngopi", "kafe"])) {
    return <Coffee {...props} />; // cangkir kopi
  }
  if (matches(lower, ["hutang", "utang", "pinjam", "cicil"])) {
    return <Banknote {...props} />; // uang kertas
  }
  if (matches(lower, ["makan", "kuliner", "jajan", "restoran", "snack"])) {
    return <Utensils {...props} />; // garpu dan sendok
  }
  if (matches(lower, ["transport", "bensin", "parkir", "ojek", "bus"])) {
    return <Car {...props} />; // mobil
  }
  if (matches(lower, ["belanja", "pasar", "groceries", "market"])) {
    return <ShoppingBasket {...props} />; // keranjang pasar
  }
  if (matches(lower, ["pakaian", "baju", "celana", "sepatu", "fashion"])) {
    return <Shirt {...props} />; // kaos
  }
  if (matches(lower, ["cukur", "salon", "perawatan", "potong"])) {
    return <Scissors {...props} />; // gunting
  }
  return <Tag {...props} />; // kategori lain
}
