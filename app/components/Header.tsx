"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors"
          onClick={closeMenu}
        >
          <span className="text-2xl">📋</span>
          <span className="hidden sm:inline">Démarche Facile</span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/demarches"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Démarches
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </nav>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
              onClick={closeMenu}
            >
              Accueil
            </Link>
            <Link
              href="/demarches"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
              onClick={closeMenu}
            >
              Démarches
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
