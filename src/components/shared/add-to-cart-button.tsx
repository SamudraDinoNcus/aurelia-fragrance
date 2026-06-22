"use client";

import { useCallback, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  slug: string;
  name: string;
  price: number;
  tagline: string;
}

export function AddToCartButton({ slug, name, price, tagline }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = useCallback(() => {
    addItem({ slug, name, price, quantity: 1, tagline });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [slug, name, price, tagline, addItem]);

  return (
    <Button variant="default" size="lg" className="flex-1" onClick={handleClick}>
      {added ? "Added!" : "Add to cart"}
    </Button>
  );
}
