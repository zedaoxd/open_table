import { Review } from "@prisma/client";

export const calculateReviewRatingAverage = (reviews: Review[]) => {
    if (!reviews.length) return 0;
    return Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1));
}