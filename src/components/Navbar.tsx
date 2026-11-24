"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, toastMessage } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cream-200/80 bg-cream-50/92 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso-900 text-caramel-400 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Coffee className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div className="leading-tight">
              <span className="block font-serif text-xl font-semibold tracking-wide text-espresso-900">
                Coffee Shop
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-caramel-600">
                Roastery &amp; Bakery
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-espresso-900 text-cream-50"
                      : "text-espresso-700 hover:bg-cream-100 hover:text-espresso-900"
                  }`}
                >
                  {link.label}
                  {link.href === "/cart" && itemCount > 0 && (
                    <span
                      className={`ml-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                        active
                          ? "bg-caramel-500 text-cream-50"
                          : "bg-caramel-500 text-cream-50"
                      }`}
                    >
                      {itemCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 rounded-full border border-espresso-900/15 bg-cream-100 px-4 py-2 text-sm font-semibold text-espresso-900 transition-all hover:border-caramel-500 hover:bg-caramel-500 hover:text-cream-50"
              aria-label={`View cart with ${itemCount} items`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Order</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-espresso-900 px-1.5 text-xs font-bold text-cream-50">
                {itemCount}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-200 text-espresso-900 hover:bg-cream-100 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-cream-200 bg-cream-50 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium ${
                      active
                        ? "bg-espresso-900 text-cream-50"
                        : "text-espresso-800 hover:bg-cream-100"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.href === "/cart" && itemCount > 0 && (
                      <span className="rounded-full bg-caramel-500 px-2 py-0.5 text-xs font-semibold text-cream-50">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-caramel-400/40 bg-espresso-900 px-5 py-3 text-sm font-medium text-cream-50 shadow-xl"
        >
          <span className="h-2 w-2 rounded-full bg-caramel-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
