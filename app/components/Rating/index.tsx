"use client";

import R from "@mui/material/Rating";

type RatingProps = {
  value: number;
};

export default function Rating({ value }: RatingProps) {
  return (
    <R name="half-rating-read" defaultValue={value} precision={0.5} readOnly />
  );
}
