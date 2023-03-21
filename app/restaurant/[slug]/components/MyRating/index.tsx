import React from "react";
import Rating from "../../../../components/Rating";

export default function MyRating() {
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <Rating value={4.9} />
        <p className="text-reg ml-3">4.9</p>
      </div>
      <div>
        <p className="text-reg ml-4">600 Reviews</p>
      </div>
    </div>
  );
}
