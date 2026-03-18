import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAllAdminProducts } from "@/lib/data/admin-products";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteProductButton } from "./delete-product-button";

export default async function AdminProductsPage() {
  const products = await getAllAdminProducts();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your store products
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="size-4" />
            New product
          </Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border bg-card">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No products yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first product to get started
            </p>
            <Link href="/admin/products/new" className="mt-4">
              <Button>Create product</Button>
            </Link>
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Compare</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Badge</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {product.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(product.price, "en")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.compareAtPrice != null
                      ? formatPrice(product.compareAtPrice, "en")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.stock > 0 ? "text-foreground" : "text-destructive"
                      }
                    >
                      {product.stock}
                    </span>
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="ml-2">
                        Out of stock
                      </Badge>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <Badge variant="secondary" className="ml-2">
                        Low stock
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.isFeatured ? (
                      <Badge variant="secondary">Yes</Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.badge ? (
                      <Badge variant="outline">{product.badge}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon-sm">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
