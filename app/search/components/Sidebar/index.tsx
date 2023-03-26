import { Cuisine, Location, Price } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface ISidebarProps {
  locations: Location[];
  cuisines: Cuisine[];
  searchParams: { city?: string; cuisine?: string; price?: Price };
}

export default function Sidebar({
  locations,
  cuisines,
  searchParams,
}: ISidebarProps) {
  const prices = [
    {
      price: Price.CHEAP,
      label: "$$",
      className: "border w-full text-reg text-center font-light rounded-l p-2",
    },
    {
      price: Price.REGULAR,
      label: "$$$",
      className: "border w-full text-reg text-center font-light p-2",
    },
    {
      price: Price.EXPENSIVE,
      label: "$$$$",
      className: "border w-full text-reg text-center font-light rounded-r p-2",
    },
  ];

  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations.map((loc) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                city: loc.name,
              },
            }}
            key={loc.id}
            className="font-light text-reg capitalize cursor-pointer"
          >
            {loc.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((c) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                cuisine: c.name,
              },
            }}
            key={c.id}
            className="font-light text-reg capitalize cursor-pointer"
          >
            {c.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {prices.map((p) => (
            <Link
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  price: p.price,
                },
              }}
              className={p.className}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
