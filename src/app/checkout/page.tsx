"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  Database,
  Loader2,
  ShoppingBag,
  Smartphone,
  Store,
  Truck,
} from "lucide-react";
import {
  useCart,
  type CartItem,
  type FulfillmentType,
} from "@/context/CartContext";
import { formatAed } from "@/data/menu";
import { createOrderInSupabase } from "@/lib/menuService";

type PaymentMethod = "card" | "apple-pay" | "cash";

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  fulfillment: FulfillmentType;
  address?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  vat: number;
  deliveryFee: number;
  total: number;
  savedToSupabase: boolean;
}

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, or tap on arrival",
    icon: CreditCard,
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    description: "Fast contactless payment in AED",
    icon: Smartphone,
  },
  {
    id: "cash",
    label: "Cash (AED)",
    description: "Pay with UAE Dirhams at pickup or delivery",
    icon: Banknote,
  },
];

export default function CheckoutPage() {
  const {
    items,
    fulfillment,
    setFulfillment,
    subtotal,
    vat,
    deliveryFee,
    total,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Jumeirah, Dubai");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim()) {
      setError("Please enter your full name and phone number.");
      return;
    }
    if (fulfillment === "delivery" && !address.trim()) {
      setError("Please enter your building or street address for delivery.");
      return;
    }

    const orderNum = `CS-${Math.floor(1000 + Math.random() * 9000)}`;
    const deliveryAddress =
      fulfillment === "delivery"
        ? `${address.trim()}, ${area.trim()}`
        : undefined;

    setSubmitting(true);
    try {
      const saveResult = await createOrderInSupabase({
        orderNumber: orderNum,
        customerName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        fulfillment,
        deliveryAddress,
        paymentMethod,
        notes: notes.trim() || undefined,
        items: items.map(({ item, quantity }) => ({
          id: item.id,
          name: item.name,
          price_aed: item.priceAed,
          quantity,
          line_total_aed: Math.round(item.priceAed * quantity * 100) / 100,
        })),
        subtotalAed: subtotal,
        vatAed: vat,
        deliveryFeeAed: deliveryFee,
        totalAed: total,
      });

      if (!saveResult.savedToSupabase) {
        setError(
          saveResult.error ??
            "Could not save order to Supabase. Please check your configuration."
        );
        return;
      }

      const snapshot: ConfirmedOrder = {
        orderNumber: orderNum,
        customerName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        fulfillment,
        address: deliveryAddress,
        paymentMethod,
        notes: notes.trim() || undefined,
        items: [...items],
        subtotal,
        vat,
        deliveryFee,
        total,
        savedToSupabase: true,
      };

      setConfirmed(snapshot);
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-cream-50 shadow-xl">
          <div className="bg-espresso-900 px-6 py-10 text-center text-cream-50 sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-caramel-500 text-cream-50">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-caramel-400">
              Order Confirmed · #{confirmed.orderNumber}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">
              Thank you, {confirmed.customerName}!
            </h1>
            <p className="mt-2 text-sm text-cream-200/80">
              {confirmed.fulfillment === "pickup"
                ? "Your freshly pulled coffee and pastries will be ready at our Jumeirah counter in 10–15 minutes."
                : `Your order is being prepared and will arrive at ${confirmed.address} in 25–35 minutes.`}
            </p>
            {confirmed.savedToSupabase && (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-caramel-400/35 bg-espresso-800 px-3.5 py-1 text-xs font-medium text-caramel-400">
                <Database className="h-3.5 w-3.5" />
                <span>Saved in Supabase orders table</span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="font-serif text-xl font-semibold text-espresso-900">
              Receipt Summary
            </h2>

            <ul className="mt-4 divide-y divide-cream-200 border-y border-cream-200">
              {confirmed.items.map(({ item, quantity }) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="text-espresso-800">
                    <span className="font-semibold text-caramel-700">
                      {quantity}×
                    </span>{" "}
                    {item.name}
                  </span>
                  <span className="font-semibold text-espresso-900">
                    {formatAed(item.priceAed * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-espresso-500">
                <dt>Subtotal</dt>
                <dd>{formatAed(confirmed.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-espresso-500">
                <dt>UAE VAT (5%)</dt>
                <dd>{formatAed(confirmed.vat)}</dd>
              </div>
              <div className="flex justify-between text-espresso-500">
                <dt>
                  {confirmed.fulfillment === "pickup"
                    ? "Café Pickup"
                    : "Delivery Fee"}
                </dt>
                <dd>
                  {confirmed.deliveryFee === 0
                    ? "FREE"
                    : formatAed(confirmed.deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-cream-200 pt-3 text-base font-bold text-espresso-900">
                <dt>Total Paid / Due</dt>
                <dd className="font-serif text-xl text-caramel-700">
                  {formatAed(confirmed.total)}
                </dd>
              </div>
            </dl>

            {confirmed.notes && (
              <div className="mt-5 rounded-xl bg-cream-100 p-3.5 text-xs text-espresso-700">
                <span className="font-semibold">Barista Notes:</span>{" "}
                {confirmed.notes}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-full bg-espresso-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-caramel-600"
              >
                Order Again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-cream-200 bg-cream-100 px-6 py-3 text-sm font-semibold text-espresso-900 transition-colors hover:border-caramel-400"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-caramel-600">
            Final Step
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-espresso-900 sm:text-4xl">
            Checkout
          </h1>
        </div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-caramel-600 transition-colors hover:text-espresso-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-cream-200 bg-cream-100/70 px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-espresso-900 text-caramel-400">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-semibold text-espresso-900">
            Nothing to check out yet
          </h2>
          <p className="mt-2 text-sm text-espresso-500">
            Add at least one drink or pastry from the menu before checking out.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso-900 px-7 py-3 text-sm font-semibold text-cream-50 hover:bg-caramel-600"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-8 lg:grid-cols-12"
        >
          {/* Left Checkout Fields */}
          <div className="space-y-6 lg:col-span-7">
            {/* Fulfillment */}
            <section className="rounded-3xl border border-cream-200 bg-cream-50 p-6 shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-espresso-900">
                1. Fulfillment Method
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFulfillment("pickup")}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    fulfillment === "pickup"
                      ? "border-caramel-500 bg-cream-100 ring-1 ring-caramel-500"
                      : "border-cream-200 hover:border-caramel-400/60"
                  }`}
                >
                  <Store className="mt-0.5 h-5 w-5 shrink-0 text-caramel-600" />
                  <div>
                    <p className="text-sm font-semibold text-espresso-900">
                      Café Pickup
                    </p>
                    <p className="mt-0.5 text-xs text-espresso-500">
                      Ready in 10–15 mins · Free
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillment("delivery")}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    fulfillment === "delivery"
                      ? "border-caramel-500 bg-cream-100 ring-1 ring-caramel-500"
                      : "border-cream-200 hover:border-caramel-400/60"
                  }`}
                >
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-caramel-600" />
                  <div>
                    <p className="text-sm font-semibold text-espresso-900">
                      Dubai Delivery
                    </p>
                    <p className="mt-0.5 text-xs text-espresso-500">
                      25–35 mins · 10 AED (Free over 80 AED)
                    </p>
                  </div>
                </button>
              </div>
            </section>

            {/* Contact & Address */}
            <section className="rounded-3xl border border-cream-200 bg-cream-50 p-6 shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-espresso-900">
                2. Your Details
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold uppercase tracking-wider text-espresso-700"
                  >
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Layla Al Mansoori"
                    className="mt-1.5 w-full rounded-xl border border-cream-200 bg-cream-100/60 px-4 py-2.5 text-sm text-espresso-900 placeholder:text-espresso-500/60 focus:border-caramel-500 focus:bg-cream-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold uppercase tracking-wider text-espresso-700"
                  >
                    Mobile Number (UAE) *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="mt-1.5 w-full rounded-xl border border-cream-200 bg-cream-100/60 px-4 py-2.5 text-sm text-espresso-900 placeholder:text-espresso-500/60 focus:border-caramel-500 focus:bg-cream-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-espresso-700"
                  >
                    Email (Optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1.5 w-full rounded-xl border border-cream-200 bg-cream-100/60 px-4 py-2.5 text-sm text-espresso-900 placeholder:text-espresso-500/60 focus:border-caramel-500 focus:bg-cream-50 focus:outline-none"
                  />
                </div>

                {fulfillment === "delivery" && (
                  <>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-xs font-semibold uppercase tracking-wider text-espresso-700"
                      >
                        Building / Street Address *
                      </label>
                      <input
                        id="address"
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Villa 14, Street 8B"
                        className="mt-1.5 w-full rounded-xl border border-cream-200 bg-cream-100/60 px-4 py-2.5 text-sm text-espresso-900 placeholder:text-espresso-500/60 focus:border-caramel-500 focus:bg-cream-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="area"
                        className="block text-xs font-semibold uppercase tracking-wider text-espresso-700"
                      >
                        Area / Emirate
                      </label>
                      <input
                        id="area"
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-cream-200 bg-cream-100/60 px-4 py-2.5 text-sm text-espresso-900 focus:border-caramel-500 focus:bg-cream-50 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-xs font-semibold uppercase tracking-wider text-espresso-700"
                  >
                    Barista &amp; Pastry Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Oat milk, less ice, extra warm croissant..."
                    className="mt-1.5 w-full rounded-xl border border-cream-200 bg-cream-100/60 px-4 py-2.5 text-sm text-espresso-900 placeholder:text-espresso-500/60 focus:border-caramel-500 focus:bg-cream-50 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="rounded-3xl border border-cream-200 bg-cream-50 p-6 shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-espresso-900">
                3. Payment Method
              </h2>
              <div className="mt-4 space-y-3">
                {PAYMENT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = paymentMethod === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id)}
                      className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-caramel-500 bg-cream-100 ring-1 ring-caramel-500"
                          : "border-cream-200 hover:border-caramel-400/60"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          active
                            ? "bg-espresso-900 text-caramel-400"
                            : "bg-cream-100 text-espresso-700"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-espresso-900">
                          {option.label}
                        </p>
                        <p className="text-xs text-espresso-500">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-caramel-600/40 bg-caramel-500/15 px-4 py-3 text-sm font-medium text-espresso-900">
                {error}
              </div>
            )}
          </div>

          {/* Right Order Summary */}
          <aside className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl bg-espresso-900 p-6 text-cream-50 shadow-xl sm:p-7">
              <h2 className="font-serif text-2xl font-semibold text-cream-50">
                Your Order
              </h2>

              <ul className="mt-5 divide-y divide-espresso-800">
                {items.map(({ item, quantity }) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-espresso-800 text-xs font-bold text-caramel-400">
                        {quantity}
                      </span>
                      <div>
                        <p className="font-medium text-cream-50">{item.name}</p>
                        <p className="text-xs text-cream-200/60">
                          {formatAed(item.priceAed)} each
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-cream-100">
                      {formatAed(item.priceAed * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2.5 border-t border-espresso-700/80 pt-5 text-sm">
                <div className="flex justify-between text-cream-200/80">
                  <dt>Subtotal</dt>
                  <dd className="text-cream-50">{formatAed(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-cream-200/80">
                  <dt>UAE VAT (5%)</dt>
                  <dd className="text-cream-50">{formatAed(vat)}</dd>
                </div>
                <div className="flex justify-between text-cream-200/80">
                  <dt>
                    {fulfillment === "pickup" ? "Café Pickup" : "Delivery Fee"}
                  </dt>
                  <dd className="text-caramel-400">
                    {deliveryFee === 0 ? "FREE" : formatAed(deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-espresso-700/80 pt-4 text-base font-bold">
                  <dt>Total</dt>
                  <dd className="font-serif text-2xl text-caramel-400">
                    {formatAed(total)}
                  </dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-caramel-500 px-6 py-4 text-sm font-semibold text-cream-50 shadow-lg transition-colors hover:bg-caramel-600 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <span>Place Order · {formatAed(total)}</span>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] text-cream-200/60">
                Orders are saved directly to your Supabase database · Prices in
                AED
              </p>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}
