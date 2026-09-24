import ThemeToggle from "@/components/ThemeToggle";

// Layout auth (DESIGN §4.1): kartu terpusat satu kolom maksimal 400px
// di atas background netral.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <p className="text-[18px] font-bold leading-6 text-primary">
          DUITku
        </p>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-8">
        <div className="w-full max-w-[400px] rounded-[6px] bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
