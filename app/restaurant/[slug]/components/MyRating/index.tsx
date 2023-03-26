import React from "react";
import R from "../../../../components/Rating";

export default function Rating() {
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <R value={4.9} />
        <p className="text-reg ml-3">4.9</p>
      </div>
      <div>
        <p className="text-reg ml-4">600 Reviews</p>
      </div>
    </div>
  );
}
