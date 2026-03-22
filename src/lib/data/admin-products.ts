import { prisma } from "@/lib/db";
import { normalizeMediaSrc } from "@/lib/media-url";

function sanitizeImageUrls(urls: string[]) {
  return urls
    .map((u) => normalizeMediaSrc(u.trim()))
    .filter((u) => u.length > 0);
}

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { select: { id: true, url: true, alt: true, order: true }, orderBy: { order: "asc" } },
} as const;

export type AdminProductWithRelations = Awaited<
  ReturnType<typeof getAdminProductById>
> extends infer T
  ? T extends null
    ? never
    : T
  : never;

export async function getAllAdminProducts() {
  return prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function createProduct(data: {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  details: string;
  price: number;
  compareAtPrice: number | null;
  badge: string | null;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  isFeatured: boolean;
  categoryId: string;
  imageUrls: string[];
}) {
  const { imageUrls, ...productData } = data;
  const cleanUrls = sanitizeImageUrls(imageUrls);
  return prisma.product.create({
    data: {
      ...productData,
      images: {
        create: cleanUrls.map((url, index) => ({ url, order: index })),
      },
    },
    include: productInclude,
  });
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    details: string;
    price: number;
    compareAtPrice: number | null;
    badge: string | null;
    rating: number;
    reviewCount: number;
    stock: number;
    sku: string;
    isFeatured: boolean;
    categoryId: string;
    imageUrls: string[];
  }
) {
  const { imageUrls, ...productData } = data;
  const validUrls = sanitizeImageUrls(imageUrls);

  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        ...productData,
        images: {
          create: validUrls.map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
    }),
  ]);

  return getAdminProductById(id);
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}
