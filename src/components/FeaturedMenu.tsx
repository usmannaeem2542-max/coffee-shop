"use client";

import React, { useEffect, useState } from "react";
import { MENU_ITEMS, type MenuItem } from "@/data/menu";
import { fetchMenuItems } from "@/lib/menuService";
import { MenuCard } from "@/components/MenuCard";

export function FeaturedMenu() {
  const [items, setItems] = useState<MenuItem[]>(() =>
    MENU_ITEMS.filter((item) => item.featured).slice(0, 4)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMenuItems()
      .then((res) => {
        if (!active) return;
        const featured = res.items.filter((item) => item.featured);
        setItems((featured.length > 0 ? featured : res.items).slice(0, 4));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading && items.length === 0) {
    return (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-96 animate-pulse rounded-2xl border border-cream-200 bg-cream-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
}
