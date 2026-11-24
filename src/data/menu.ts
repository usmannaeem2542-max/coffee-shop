export type MenuCategory = "Hot Coffee" | "Iced Coffee" | "Pastries & Snacks";

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  priceAed: number;
  description: string;
  notes: string;
  size: string;
  badge?: string;
  featured?: boolean;
  image: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "double-espresso",
    name: "Double Espresso",
    category: "Hot Coffee",
    priceAed: 16,
    description:
      "Rich single-origin Ethiopian dark roast pulled to a velvety golden crema with dark cocoa depth.",
    notes: "Dark Cocoa · Roasted Hazelnut",
    size: "60 ml",
    badge: "Single Origin",
    featured: true,
    image: "/images/espresso.jpg",
  },
  {
    id: "caramel-latte",
    name: "Signature Caramel Latte",
    category: "Hot Coffee",
    priceAed: 24,
    description:
      "Double ristretto folded into silky microfoamed milk and our house-made salted burnt caramel.",
    notes: "Burnt Caramel · Sweet Cream",
    size: "240 ml",
    badge: "House Favorite",
    featured: true,
    image: "/images/latte.jpg",
  },
  {
    id: "artisan-cappuccino",
    name: "Artisan Cappuccino",
    category: "Hot Coffee",
    priceAed: 22,
    description:
      "Classic balanced harmony of bold espresso, warm milk, and dense velvety foam finished with raw cacao.",
    notes: "Velvet Foam · Raw Cacao",
    size: "180 ml",
    featured: false,
    image: "/images/cappuccino.jpg",
  },
  {
    id: "cold-brew-iced-coffee",
    name: "Cold Brew Iced Coffee",
    category: "Iced Coffee",
    priceAed: 23,
    description:
      "Slow-steeped for 18 hours and poured over crystal ice with a smooth whisper of toasted vanilla.",
    notes: "Toasted Vanilla · Molasses",
    size: "320 ml",
    badge: "18-Hr Steep",
    featured: true,
    image: "/images/iced-coffee.jpg",
  },
  {
    id: "iced-spanish-latte",
    name: "Iced Spanish Latte",
    category: "Iced Coffee",
    priceAed: 26,
    description:
      "Bold house espresso ribboned through chilled creamy milk and sweet condensed milk over ice.",
    notes: "Sweet Milk · Rich Espresso",
    size: "320 ml",
    badge: "Bestseller",
    featured: false,
    image: "/images/spanish-latte.jpg",
  },
  {
    id: "butter-croissant",
    name: "French Butter Croissant",
    category: "Pastries & Snacks",
    priceAed: 18,
    description:
      "Honeycombed, deeply flaky laminated pastry baked every morning with cultured Normandy butter.",
    notes: "Cultured Butter · Crisp Layers",
    size: "Fresh Baked",
    badge: "Baked at Dawn",
    featured: true,
    image: "/images/croissant.jpg",
  },
  {
    id: "caramel-cinnamon-roll",
    name: "Caramel Pecan Cinnamon Roll",
    category: "Pastries & Snacks",
    priceAed: 25,
    description:
      "Warm pillowy brioche swirl layered with Ceylon cinnamon, espresso-caramel glaze, and roasted pecans.",
    notes: "Ceylon Cinnamon · Toasted Pecan",
    size: "Served Warm",
    featured: false,
    image: "/images/cinnamon-roll.jpg",
  },
  {
    id: "espresso-chocolate-brownie",
    name: "Espresso Chocolate Brownie",
    category: "Pastries & Snacks",
    priceAed: 21,
    description:
      "Fudgy 70% dark Belgian chocolate brownie infused with house espresso and finished with flaky sea salt.",
    notes: "70% Dark Cacao · Sea Salt",
    size: "110 g",
    featured: false,
    image: "/images/brownie.jpg",
  },
];

export const MENU_CATEGORIES: ("All" | MenuCategory)[] = [
  "All",
  "Hot Coffee",
  "Iced Coffee",
  "Pastries & Snacks",
];

export function formatAed(amount: number): string {
  const formatted = Number.isInteger(amount)
    ? amount.toString()
    : amount.toFixed(2);
  return `${formatted} AED`;
}
