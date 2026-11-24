import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Coffee,
  Croissant,
  Flame,
  MapPin,
  Sparkles,
} from "lucide-react";
import { FeaturedMenu } from "@/components/FeaturedMenu";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-espresso-950 text-cream-50">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero.jpg"
            alt="Artisan espresso bar at Coffee Shop"
            className="h-full w-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso-950 via-espresso-950/85 to-espresso-900/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-transparent to-espresso-950/40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-caramel-400/35 bg-espresso-900/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-caramel-400 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Small-Batch Roastery · Dubai</span>
            </div>

            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">
              Velvet Espresso, Burnt Caramel &amp; Warm Morning Pastries.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-200/85 sm:text-lg">
              Crafted daily in small batches using single-origin beans, house
              caramel reductions, and cultured French butter pastries. Order
              online for café pickup or delivery across Dubai in AED.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2.5 rounded-full bg-caramel-500 px-7 py-3.5 text-sm font-semibold text-cream-50 shadow-lg shadow-espresso-950/40 transition-all hover:bg-caramel-600"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-cream-200/30 bg-espresso-900/60 px-7 py-3.5 text-sm font-semibold text-cream-50 backdrop-blur-sm transition-colors hover:border-caramel-400 hover:bg-espresso-800"
              >
                View Your Cart
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-cream-200/15 pt-7">
              <div>
                <p className="font-serif text-2xl font-bold text-caramel-400">
                  8
                </p>
                <p className="mt-0.5 text-xs text-cream-200/75">
                  Crafted Drinks &amp; Snacks
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-caramel-400">
                  16–26 AED
                </p>
                <p className="mt-0.5 text-xs text-cream-200/75">
                  Everyday Café Prices
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-caramel-400">
                  15 min
                </p>
                <p className="mt-0.5 text-xs text-cream-200/75">
                  Fresh Counter Pickup
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craft Pillars */}
      <section className="border-b border-cream-200 bg-cream-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-espresso-900 text-caramel-400">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-semibold text-espresso-900">
                Dark-Roasted Daily
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-espresso-500">
                Single-origin Ethiopian and Colombian lots roasted to highlight
                rich cocoa and warm caramel sweetness.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-espresso-900 text-caramel-400">
              <Croissant className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-semibold text-espresso-900">
                Baked at Dawn
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-espresso-500">
                Flaky croissants, warm pecan cinnamon rolls, and fudgy espresso
                brownies straight from our stone deck oven.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-espresso-900 text-caramel-400">
              <Coffee className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-semibold text-espresso-900">
                House-Made Caramel
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-espresso-500">
                Small-batch salted burnt caramel and 18-hour cold brew steeped
                slowly for a silky, balanced finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-caramel-600">
              Barista Highlights
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-espresso-900 sm:text-4xl">
              Signature Pours &amp; Bakes
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-caramel-600 transition-colors hover:text-espresso-900"
          >
            <span>See all 8 menu items</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <FeaturedMenu />
      </section>

      {/* Roastery Story Banner */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-espresso-900 text-cream-50 shadow-xl">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:p-14">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-caramel-400">
                The Coffee Shop Ritual
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-snug text-cream-50 sm:text-4xl">
                Warm espresso tones, slow mornings, and pastries meant to be
                shared.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream-200/80 sm:text-base">
                Whether you&apos;re stopping by for a quick Double Espresso
                before work or ordering Iced Spanish Lattes and Butter
                Croissants to your door, every cup is dialed in to order. Free
                Dubai delivery on orders over 80 AED.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-full bg-caramel-500 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-caramel-600"
                >
                  <span>Order Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/checkout"
                  className="inline-flex items-center gap-2 rounded-full border border-cream-200/25 px-6 py-3 text-sm font-semibold text-cream-100 transition-colors hover:border-caramel-400 hover:text-caramel-400"
                >
                  Go to Checkout
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-caramel-400/20 bg-espresso-800/75 p-6 lg:col-span-5">
              <h3 className="font-serif text-xl font-semibold text-cream-50">
                Café Hours &amp; Pickup
              </h3>
              <ul className="mt-5 space-y-4 text-sm text-cream-200/85">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
                  <div>
                    <p className="font-semibold text-cream-50">Jumeirah Bar</p>
                    <p className="text-cream-200/70">
                      Al Wasl Road, Jumeirah 2, Dubai
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
                  <div>
                    <p className="font-semibold text-cream-50">Open Daily</p>
                    <p className="text-cream-200/70">7:00 AM – 11:00 PM</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 rounded-xl bg-espresso-950/60 p-4 text-xs leading-relaxed text-caramel-400">
                Tip: Pick up at the counter in 10–15 minutes with zero fees, or
                enjoy free delivery on orders of 80 AED or more.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
