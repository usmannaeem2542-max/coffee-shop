-- ============================================================
-- Coffee Shop — Supabase Schema (menu_items & orders)
-- Paste this into your Supabase Dashboard -> SQL Editor -> Run
-- ============================================================

-- 1. MENU ITEMS TABLE
create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  category text not null check (category in ('Hot Coffee', 'Iced Coffee', 'Pastries & Snacks')),
  price_aed numeric(10, 2) not null check (price_aed >= 0),
  description text not null,
  notes text not null default '',
  size text not null default '',
  badge text,
  featured boolean not null default false,
  image_url text not null,
  sort_order integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. ORDERS TABLE
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  fulfillment text not null check (fulfillment in ('pickup', 'delivery')),
  delivery_address text,
  payment_method text not null check (payment_method in ('card', 'apple-pay', 'cash')),
  notes text,
  items jsonb not null,
  subtotal_aed numeric(10, 2) not null,
  vat_aed numeric(10, 2) not null,
  delivery_fee_aed numeric(10, 2) not null default 0,
  total_aed numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;

-- Public can read available menu items
drop policy if exists "Public can read menu_items" on public.menu_items;
create policy "Public can read menu_items"
  on public.menu_items
  for select
  to anon, authenticated
  using (is_available = true);

-- Public can place new orders
drop policy if exists "Public can insert orders" on public.orders;
create policy "Public can insert orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

-- Seed the 8 sample drinks and snacks (prices in AED)
insert into public.menu_items
  (id, name, category, price_aed, description, notes, size, badge, featured, image_url, sort_order)
values
  (
    'double-espresso',
    'Double Espresso',
    'Hot Coffee',
    16,
    'Rich single-origin Ethiopian dark roast pulled to a velvety golden crema with dark cocoa depth.',
    'Dark Cocoa · Roasted Hazelnut',
    '60 ml',
    'Single Origin',
    true,
    '/images/espresso.jpg',
    1
  ),
  (
    'caramel-latte',
    'Signature Caramel Latte',
    'Hot Coffee',
    24,
    'Double ristretto folded into silky microfoamed milk and our house-made salted burnt caramel.',
    'Burnt Caramel · Sweet Cream',
    '240 ml',
    'House Favorite',
    true,
    '/images/latte.jpg',
    2
  ),
  (
    'artisan-cappuccino',
    'Artisan Cappuccino',
    'Hot Coffee',
    22,
    'Classic balanced harmony of bold espresso, warm milk, and dense velvety foam finished with raw cacao.',
    'Velvet Foam · Raw Cacao',
    '180 ml',
    null,
    false,
    '/images/cappuccino.jpg',
    3
  ),
  (
    'cold-brew-iced-coffee',
    'Cold Brew Iced Coffee',
    'Iced Coffee',
    23,
    'Slow-steeped for 18 hours and poured over crystal ice with a smooth whisper of toasted vanilla.',
    'Toasted Vanilla · Molasses',
    '320 ml',
    '18-Hr Steep',
    true,
    '/images/iced-coffee.jpg',
    4
  ),
  (
    'iced-spanish-latte',
    'Iced Spanish Latte',
    'Iced Coffee',
    26,
    'Bold house espresso ribboned through chilled creamy milk and sweet condensed milk over ice.',
    'Sweet Milk · Rich Espresso',
    '320 ml',
    'Bestseller',
    false,
    '/images/spanish-latte.jpg',
    5
  ),
  (
    'butter-croissant',
    'French Butter Croissant',
    'Pastries & Snacks',
    18,
    'Honeycombed, deeply flaky laminated pastry baked every morning with cultured Normandy butter.',
    'Cultured Butter · Crisp Layers',
    'Fresh Baked',
    'Baked at Dawn',
    true,
    '/images/croissant.jpg',
    6
  ),
  (
    'caramel-cinnamon-roll',
    'Caramel Pecan Cinnamon Roll',
    'Pastries & Snacks',
    25,
    'Warm pillowy brioche swirl layered with Ceylon cinnamon, espresso-caramel glaze, and roasted pecans.',
    'Ceylon Cinnamon · Toasted Pecan',
    'Served Warm',
    null,
    false,
    '/images/cinnamon-roll.jpg',
    7
  ),
  (
    'espresso-chocolate-brownie',
    'Espresso Chocolate Brownie',
    'Pastries & Snacks',
    21,
    'Fudgy 70% dark Belgian chocolate brownie infused with house espresso and finished with flaky sea salt.',
    '70% Dark Cacao · Sea Salt',
    '110 g',
    null,
    false,
    '/images/brownie.jpg',
    8
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price_aed = excluded.price_aed,
  description = excluded.description,
  notes = excluded.notes,
  size = excluded.size,
  badge = excluded.badge,
  featured = excluded.featured,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
