import {
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
} from "@/data/menu";
import { getSupabaseClient } from "@/lib/supabase";

interface SupabaseMenuItemRow {
  id: string;
  name: string;
  category: string;
  price_aed: number | string;
  description: string;
  notes: string | null;
  size: string | null;
  badge: string | null;
  featured: boolean | null;
  image_url: string;
}

export interface MenuFetchResult {
  items: MenuItem[];
  source: "supabase" | "fallback";
  error?: string;
}

export interface OrderItemPayload {
  id: string;
  name: string;
  price_aed: number;
  quantity: number;
  line_total_aed: number;
}

export interface CreateOrderInput {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  fulfillment: "pickup" | "delivery";
  deliveryAddress?: string;
  paymentMethod: "card" | "apple-pay" | "cash";
  notes?: string;
  items: OrderItemPayload[];
  subtotalAed: number;
  vatAed: number;
  deliveryFeeAed: number;
  totalAed: number;
}

export interface CreateOrderResult {
  savedToSupabase: boolean;
  error?: string;
}

const VALID_CATEGORIES = new Set<MenuCategory>([
  "Hot Coffee",
  "Iced Coffee",
  "Pastries & Snacks",
]);

function mapRowToMenuItem(row: SupabaseMenuItemRow): MenuItem {
  const category: MenuCategory = VALID_CATEGORIES.has(
    row.category as MenuCategory
  )
    ? (row.category as MenuCategory)
    : "Hot Coffee";

  return {
    id: row.id,
    name: row.name,
    category,
    priceAed: Number(row.price_aed),
    description: row.description,
    notes: row.notes ?? "",
    size: row.size ?? "",
    badge: row.badge ?? undefined,
    featured: Boolean(row.featured),
    image: row.image_url,
  };
}

export async function fetchMenuItems(): Promise<MenuFetchResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      items: MENU_ITEMS,
      source: "fallback",
      error: "Supabase is not configured in .env.local yet.",
    };
  }

  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        "id, name, category, price_aed, description, notes, size, badge, featured, image_url"
      )
      .eq("is_available", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      return {
        items: MENU_ITEMS,
        source: "fallback",
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        items: MENU_ITEMS,
        source: "fallback",
        error: "No rows found in Supabase menu_items table yet.",
      };
    }

    return {
      items: (data as SupabaseMenuItemRow[]).map(mapRowToMenuItem),
      source: "supabase",
    };
  } catch (err) {
    return {
      items: MENU_ITEMS,
      source: "fallback",
      error: err instanceof Error ? err.message : "Failed to query Supabase.",
    };
  }
}

export async function createOrderInSupabase(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      savedToSupabase: false,
      error:
        "Supabase credentials are missing in .env.local. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to save orders.",
    };
  }

  try {
    const { error } = await supabase.from("orders").insert({
      order_number: input.orderNumber,
      customer_name: input.customerName,
      phone: input.phone,
      email: input.email || null,
      fulfillment: input.fulfillment,
      delivery_address: input.deliveryAddress || null,
      payment_method: input.paymentMethod,
      notes: input.notes || null,
      items: input.items,
      subtotal_aed: input.subtotalAed,
      vat_aed: input.vatAed,
      delivery_fee_aed: input.deliveryFeeAed,
      total_aed: input.totalAed,
      status: "pending",
    });

    if (error) {
      return {
        savedToSupabase: false,
        error: error.message,
      };
    }

    return { savedToSupabase: true };
  } catch (err) {
    return {
      savedToSupabase: false,
      error:
        err instanceof Error
          ? err.message
          : "Unexpected error while saving order to Supabase.",
    };
  }
}
