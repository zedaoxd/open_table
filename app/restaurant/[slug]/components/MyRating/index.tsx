import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../../../../utils/calculateReviewRatingAverage";
import R from "../../../../components/Rating";

export default function Rating({ reviews }: { reviews: Review[] }) {
  const reviewsAverage = calculateReviewRatingAverage(reviews);
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <R value={reviewsAverage} />
        <p className="text-reg ml-3">{reviewsAverage}</p>
      </div>
      <div>
        <p className="text-reg ml-4">
          {reviews.length} Review{reviews.length > 1 && "s"}
        </p>
      </div>
    </div>
  );
}
