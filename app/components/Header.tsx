"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ClipboardCheckIcon, MenuIcon, XIcon } from "./Icons";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/demarches", label: "Démarches" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-slate-950"
          onClick={closeMenu}
        >
          <span className="grid size-10 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
            <ClipboardCheckIcon className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold sm:text-lg">
              Démarche Facile
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Vos papiers, sans vous perdre
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-100 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:text-blue-700 md:hidden"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
