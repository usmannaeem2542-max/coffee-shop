"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MENU_ITEMS, formatAed } from "@/data/menu";

export default function CartPage() {
  const {
    items,
    itemCount,
    fulfillment,
    setFulfillment,
    subtotal,
    vat,
    deliveryFee,
    total,
    freeDeliveryThreshold,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const remainingForFreeDelivery = Math.max(
    0,
    freeDeliveryThreshold - subtotal
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-caramel-600">
            Your Coffee Order
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-espresso-900 sm:text-4xl">
            Shopping Cart
          </h1>
        </div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-caramel-600 transition-colors hover:text-espresso-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Browsing Menu</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-cream-200 bg-cream-100/70 px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-espresso-900 text-caramel-400">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-semibold text-espresso-900">
            Your cart is currently empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-espresso-500">
            Start with a velvety Signature Caramel Latte or a freshly baked
            French Butter Croissant from our menu.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-espresso-900 px-7 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-caramel-600"
            >
              <span>Browse Full Menu</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto mt-12 max-w-3xl border-t border-cream-200 pt-8 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-600">
              Quick Add Favorites
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {MENU_ITEMS.slice(0, 3).map((quick) => (
                <div
                  key={quick.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-serif text-base font-semibold text-espresso-900">
                      {quick.name}
                    </p>
                    <p className="text-xs font-semibold text-caramel-600">
                      {formatAed(quick.priceAed)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem(quick)}
                    className="shrink-0 rounded-xl bg-espresso-900 px-3 py-1.5 text-xs font-semibold text-cream-50 hover:bg-caramel-600"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-8">
            <div className="flex items-center justify-between text-sm text-espresso-500">
              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"} selected
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-500 transition-colors hover:text-caramel-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Cart</span>
              </button>
            </div>

            {items.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-xs sm:flex-row sm:items-center sm:p-5"
              >
                <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-espresso-900 sm:w-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-caramel-600">
                    {item.category}
                  </p>
                  <h2 className="mt-0.5 font-serif text-xl font-semibold text-espresso-900">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-xs text-espresso-500">
                    {formatAed(item.priceAed)} each · {item.size}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="font-serif text-lg font-bold text-espresso-900">
                    {formatAed(item.priceAed * quantity)}
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-xl border border-cream-200 bg-cream-100 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-cream-50 text-espresso-900 transition-colors hover:bg-espresso-900 hover:text-cream-50"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-espresso-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-caramel-500 text-cream-50 transition-colors hover:bg-caramel-600"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-200 text-espresso-500 transition-colors hover:border-caramel-500 hover:text-caramel-700"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl border border-cream-200 bg-espresso-900 p-6 text-cream-50 shadow-xl">
              <h2 className="font-serif text-2xl font-semibold text-cream-50">
                Order Summary
              </h2>

              {/* Fulfillment Mode */}
              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-espresso-950/70 p-1.5">
                <button
                  type="button"
                  onClick={() => setFulfillment("pickup")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                    fulfillment === "pickup"
                      ? "bg-caramel-500 text-cream-50"
                      : "text-cream-200/75 hover:text-cream-50"
                  }`}
                >
                  <Store className="h-4 w-4" />
                  <span>Pickup (Free)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("delivery")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                    fulfillment === "delivery"
                      ? "bg-caramel-500 text-cream-50"
                      : "text-cream-200/75 hover:text-cream-50"
                  }`}
                >
                  <Truck className="h-4 w-4" />
                  <span>Delivery</span>
                </button>
              </div>

              {fulfillment === "delivery" && (
                <div className="mt-4 rounded-xl bg-espresso-800/80 p-3.5 text-xs text-cream-200/85">
                  {remainingForFreeDelivery > 0 ? (
                    <>
                      <p>
                        Add{" "}
                        <span className="font-semibold text-caramel-400">
                          {formatAed(remainingForFreeDelivery)}
                        </span>{" "}
                        more for free Dubai delivery.
                      </p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-espresso-950">
                        <div
                          className="h-full rounded-full bg-caramel-500 transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              (subtotal / freeDeliveryThreshold) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="font-semibold text-caramel-400">
                      Unlocked: Free Dubai delivery on this order!
                    </p>
                  )}
                </div>
              )}

              <dl className="mt-6 space-y-3 border-t border-espresso-700/80 pt-5 text-sm">
                <div className="flex justify-between text-cream-200/80">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-cream-50">
                    {formatAed(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between text-cream-200/80">
                  <dt>UAE VAT (5%)</dt>
                  <dd className="font-medium text-cream-50">
                    {formatAed(vat)}
                  </dd>
                </div>
                <div className="flex justify-between text-cream-200/80">
                  <dt>
                    {fulfillment === "pickup" ? "Café Pickup" : "Delivery Fee"}
                  </dt>
                  <dd className="font-medium text-caramel-400">
                    {deliveryFee === 0 ? "FREE" : formatAed(deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-espresso-700/80 pt-4 text-base font-bold text-cream-50">
                  <dt>Total</dt>
                  <dd className="font-serif text-2xl text-caramel-400">
                    {formatAed(total)}
                  </dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-caramel-500 px-5 py-3.5 text-sm font-semibold text-cream-50 shadow-lg transition-colors hover:bg-caramel-600"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
