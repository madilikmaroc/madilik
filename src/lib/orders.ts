import { prisma } from "@/lib/db";
import {
  validateStockForCheckout,
  type StockValidationItem,
} from "@/lib/stock";

/** Shipping is free everywhere (included in product prices). */
function getShipping(_subtotal: number): number {
  return 0;
}
import type { ProductDisplay } from "@/types/product";

export interface CartItemPayload {
  product: ProductDisplay;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  location: string;
  locale: string;
  items: CartItemPayload[];
  /** When set, links the order to the authenticated customer. */
  userId?: string;
}

export type CreateOrderResult =
  | { success: true; orderId: string; orderReference: string }
  | { success: false; error: string; errorKey?: string };

export function validateOrderInput(input: unknown): { valid: false; error: string } | { valid: true; data: CreateOrderInput } {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const body = input as Record<string, unknown>;
  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const locale = typeof body.locale === "string" ? body.locale.trim() || "en" : "en";

  if (!customerName) return { valid: false, error: "Full name is required" };
  if (!phone) return { valid: false, error: "Phone is required" };
  if (!location) return { valid: false, error: "Location is required" };

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { valid: false, error: "EMPTY_CART" };
  }

  const items: CartItemPayload[] = [];
  for (const item of body.items) {
    if (!item || typeof item !== "object") continue;
    const it = item as Record<string, unknown>;
    const product = it.product;
    const quantity = typeof it.quantity === "number" ? Math.floor(it.quantity) : 0;
    if (!product || typeof product !== "object" || quantity <= 0) continue;

    const p = product as Record<string, unknown>;
    const id = typeof p.id === "string" ? p.id : "";
    const slug = typeof p.slug === "string" ? p.slug : "";
    const name = typeof p.name === "string" ? p.name : "";
    const price = typeof p.price === "number" ? p.price : 0;

    if (!id || !name || !slug || price <= 0) continue;

    items.push({
      product: {
        id,
        slug,
        name,
        price,
        shortDescription: "",
        description: "",
        details: "",
        rating: 0,
        reviewCount: 0,
        stock: 999,
        sku: "",
        isFeatured: false,
        category: { id: "", name: "", slug: "" },
        images: [],
      } as ProductDisplay,
      quantity,
    });
  }

  if (items.length === 0) {
    return { valid: false, error: "EMPTY_CART" };
  }

  return {
    valid: true,
    data: { customerName, phone, location, locale, items },
  };
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const stockItems: StockValidationItem[] = input.items.map((i) => ({
    productId: i.product.id,
    productName: i.product.name,
    quantity: i.quantity,
  }));

  const stockValidation = await validateStockForCheckout(stockItems);
  if (!stockValidation.valid && stockValidation.errorKey) {
    return {
      success: false,
      error: stockValidation.errorKey,
      errorKey: stockValidation.errorKey,
    };
  }

  const subtotal = input.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shippingCost = getShipping(subtotal);
  const total = subtotal + shippingCost;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerName: input.customerName,
        phone: input.phone,
        location: input.location,
        status: "PENDING",
        subtotal,
        shippingCost,
        total,
        currency: "MAD",
        locale: input.locale,
        ...(input.userId && { userId: input.userId }),
        items: {
          create: input.items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productSlug: item.product.slug,
            unitPrice: item.product.price,
            quantity: item.quantity,
            lineTotal: item.product.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.product.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return created;
  });

  const orderReference = `MDL-${order.id.slice(-8).toUpperCase()}`;

  return {
    success: true,
    orderId: order.id,
    orderReference,
  };
}
