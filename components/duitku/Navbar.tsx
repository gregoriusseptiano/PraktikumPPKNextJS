"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChartPie,
  House,
  Menu,
  Plus,
  ReceiptText,
  Wallet,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";

interface NavbarProps {
  displayName?: string | null;
}

export function Navbar({ displayName }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initial = (displayName ?? "K").trim().charAt(0).toUpperCase() || "K";

  const navLinks = [
    {
      label: "Beranda",
      href: "/dashboard",
      icon: House,
      active: pathname === "/dashboard",
    },
    {
      label: "Riwayat Transaksi",
      href: "/transactions",
      icon: ReceiptText,
      active: pathname.startsWith("/transactions"),
    },
    {
      label: "Laporan Keuangan",
      href: "/reports",
      icon: ChartPie,
      active: pathname.startsWith("/reports"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">
              <Wallet size={20} strokeWidth={2.2} />
            </span>
            <span className="text-xl font-bold tracking-tight text-ink">
              DUIT<span className="text-primary">ku</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Navigasi Utama" className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    item.active
                      ? "bg-primary-soft text-primary"
                      : "text-subtle hover:bg-surface hover:text-ink"
                  }`}
                >
                  <Icon size={18} strokeWidth={item.active ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions, Theme, User, Logout */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <Link
            href="/transactions/new"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Catat Transaksi</span>
          </Link>

          <div className="h-5 w-px bg-divider" />

          <ThemeToggle />

          <div className="flex items-center gap-2.5 pl-1">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20"
            >
              {initial}
            </span>
            {displayName ? (
              <span className="max-w-[120px] truncate text-xs font-medium text-ink">
                {displayName}
              </span>
            ) : null}
          </div>

          <LogoutButton />
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-divider text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-t border-divider bg-surface px-4 pt-3 pb-5 md:hidden">
          <div className="mb-3 flex items-center gap-2.5 border-b border-divider pb-3">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
            >
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {displayName ?? "Pengguna DUITku"}
              </p>
            </div>
          </div>

          <nav aria-label="Navigasi Mobile" className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    item.active
                      ? "bg-primary-soft text-primary"
                      : "text-subtle hover:bg-surface hover:text-ink"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-divider">
            <Link
              href="/transactions/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Catat Transaksi</span>
            </Link>
            <div className="flex justify-end pt-1">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
