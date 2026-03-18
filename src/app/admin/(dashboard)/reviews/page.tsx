import Link from "next/link";
import { getAllAdminReviews } from "@/lib/data/admin-reviews";
import { Badge } from "@/components/ui/badge";
import { ReviewRowActions } from "./review-row-actions";

function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max) + "…";
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminReviewsPage() {
  const reviews = await getAllAdminReviews();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
      <p className="mt-1 text-muted-foreground">
        Moderate customer reviews from your storefront
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border bg-card">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reviews will appear here when customers submit them
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 font-medium">Reviewer</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Comment</th>
                <th className="px-4 py-3 font-medium">Screenshots</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{review.user.fullName}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/shop/${review.product.slug}`}
                      className="text-primary hover:underline"
                    >
                      {review.product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{review.rating}/5</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                    {truncate(review.comment, 60)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {review.images.length}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={review.isVisible ? "default" : "secondary"}
                      className={
                        review.isVisible
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : ""
                      }
                    >
                      {review.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <ReviewRowActions
                      reviewId={review.id}
                      isVisible={review.isVisible}
                    />
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
