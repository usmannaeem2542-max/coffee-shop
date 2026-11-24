"use client";

import React from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { formatAed, type MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const qty = getItemQuantity(item.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-caramel-400/70 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-espresso-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent" />

        {item.badge && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-espresso-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-caramel-400 backdrop-blur-sm">
            {item.badge}
          </span>
        )}

        <span className="absolute bottom-3 left-3.5 rounded-full bg-cream-50/92 px-2.5 py-0.5 text-[11px] font-medium text-espresso-800 backdrop-blur-sm">
          {item.size}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-caramel-600">
              {item.category}
            </p>
            <h3 className="mt-1 font-serif text-xl font-semibold text-espresso-900">
              {item.name}
            </h3>
          </div>
          <span className="shrink-0 rounded-lg bg-cream-100 px-2.5 py-1 font-serif text-lg font-bold text-espresso-900">
            {formatAed(item.priceAed)}
          </span>
        </div>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-espresso-500">
          {item.description}
        </p>

        <p className="mt-3 text-xs font-medium text-espresso-700/80">
          Notes: <span className="text-caramel-700">{item.notes}</span>
        </p>

        <div className="mt-5 border-t border-cream-200/80 pt-4">
          {qty === 0 ? (
            <button
              type="button"
              onClick={() => addItem(item)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-espresso-900 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-caramel-600 active:scale-[0.99]"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-caramel-500/40 bg-cream-100 p-1">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, qty - 1)}
                className="flex h-8 w-9 items-center justify-center rounded-lg bg-cream-50 text-espresso-900 shadow-xs transition-colors hover:bg-espresso-900 hover:text-cream-50"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-espresso-900">
                {qty} in cart
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, qty + 1)}
                className="flex h-8 w-9 items-center justify-center rounded-lg bg-caramel-500 text-cream-50 shadow-xs transition-colors hover:bg-caramel-600"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
