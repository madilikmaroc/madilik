"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import type { ProductDisplay } from "@/types/product";
import { useLanguage } from "@/contexts/language-context";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/storefront";

interface ProductDetailsClientProps {
  product: ProductDisplay;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector
          value={quantity}
          onValueChange={setQuantity}
          max={product.stock}
        />
        <Button
          size="lg"
          className="min-w-[200px] flex-1"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          {t("product.addToCart")}
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`size-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
}
