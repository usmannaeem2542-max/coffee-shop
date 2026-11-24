import Link from "next/link";
import { Clock, Coffee, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-espresso-800 bg-espresso-950 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-caramel-500/15 text-caramel-400 ring-1 ring-caramel-400/30">
              <Coffee className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-serif text-xl font-semibold text-cream-50">
                Coffee Shop
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-caramel-400">
                Small-Batch Roastery &amp; Bakery
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-200/75">
            Hand-pulled single-origin espresso, velvet caramel lattes, and
            warm butter pastries baked every morning. Crafted for unhurried
            mornings and late-evening conversations.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-400">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-cream-200/80">
            <li>
              <Link href="/" className="transition-colors hover:text-cream-50">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/menu"
                className="transition-colors hover:text-cream-50"
              >
                Full Menu (AED)
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="transition-colors hover:text-cream-50"
              >
                Your Cart
              </Link>
            </li>
            <li>
              <Link
                href="/checkout"
                className="transition-colors hover:text-cream-50"
              >
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-400">
            Visit Us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-cream-200/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
              <span>Al Wasl Road, Jumeirah 2, Dubai, UAE</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
              <span>Daily · 7:00 AM – 11:00 PM</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
              <span>+971 4 555 0194</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-espresso-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-cream-200/55 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Coffee Shop. All rights reserved.</p>
          <p>All prices displayed in UAE Dirhams (AED) · 5% VAT applied at checkout.</p>
        </div>
      </div>
    </footer>
  );
}
