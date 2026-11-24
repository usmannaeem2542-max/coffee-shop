"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Database, Search, ShoppingBag } from "lucide-react";
import {
  MENU_CATEGORIES,
  formatAed,
  type MenuCategory,
  type MenuItem,
} from "@/data/menu";
import { fetchMenuItems } from "@/lib/menuService";
import { MenuCard } from "@/components/MenuCard";
import { useCart } from "@/context/CartContext";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | MenuCategory
  >("All");
  const [query, setQuery] = useState("");
  const { itemCount, subtotal } = useCart();

  useEffect(() => {
    let active = true;
    fetchMenuItems()
      .then((res) => {
        if (!active) return;
        setMenuItems(res.items);
        setSource(res.source);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [menuItems, selectedCategory, query]);

  const countForCategory = (cat: "All" | MenuCategory) =>
    cat === "All"
      ? menuItems.length
      : menuItems.filter((i) => i.category === cat).length;

  return (
    <div className="pb-24">
      {/* Header Band */}
      <section className="border-b border-espresso-800 bg-espresso-900 text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-caramel-400">
              Crafted to Order · Prices in AED
            </p>
            {!loading && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-caramel-400/30 bg-espresso-800/80 px-3 py-1 text-[11px] font-medium text-cream-200">
                <Database className="h-3 w-3 text-caramel-400" />
                {source === "supabase"
                  ? "Live from Supabase"
                  : "Sample Menu (Connect Supabase in .env.local)"}
              </span>
            )}
          </div>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
            Our Coffee &amp; Bakery Menu
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-200/80 sm:text-base">
            Explore our house-roasted drinks and fresh-baked snacks — from
            velvety espresso and salted caramel lattes to chilled cold brew and
            flaky butter croissants.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-20 z-30 border-b border-cream-200 bg-cream-50/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {MENU_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-espresso-900 text-cream-50 shadow-xs"
                      : "border border-cream-200 bg-cream-100 text-espresso-700 hover:border-caramel-400 hover:text-espresso-900"
                  }`}
                >
                  {category}{" "}
                  <span
                    className={`ml-1 text-xs ${
                      active ? "text-caramel-400" : "text-espresso-500"
                    }`}
                  >
                    ({countForCategory(category)})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search espresso, croissant..."
              className="w-full rounded-full border border-cream-200 bg-cream-100/80 py-2 pl-10 pr-4 text-sm text-espresso-900 placeholder:text-espresso-500/70 focus:border-caramel-500 focus:bg-cream-50 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-cream-200 bg-cream-100/80"
              >
                <div className="aspect-[4/3] animate-pulse bg-cream-200/70" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-cream-200" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-cream-200" />
                  <div className="h-12 w-full animate-pulse rounded bg-cream-200/70" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-cream-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-cream-200 bg-cream-100/70 px-6 py-16 text-center">
            <p className="font-serif text-2xl font-semibold text-espresso-900">
              No matching drinks or snacks
            </p>
            <p className="mt-2 text-sm text-espresso-500">
              Try clearing your search or switching back to all menu items.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setQuery("");
              }}
              className="mt-5 rounded-full bg-espresso-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-caramel-600"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Floating Cart Summary Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-caramel-400/40 bg-espresso-900 px-5 py-3.5 text-cream-50 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-caramel-500 text-cream-50">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </p>
                <p className="text-xs text-caramel-400">
                  Subtotal: {formatAed(subtotal)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="rounded-xl border border-cream-200/25 px-4 py-2 text-xs font-semibold text-cream-100 transition-colors hover:border-caramel-400 hover:text-caramel-400 sm:text-sm"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-1.5 rounded-xl bg-caramel-500 px-4 py-2 text-xs font-semibold text-cream-50 transition-colors hover:bg-caramel-600 sm:text-sm"
              >
                <span>Checkout</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
