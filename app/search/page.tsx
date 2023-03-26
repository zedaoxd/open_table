import { PrismaClient } from "@prisma/client";
import React from "react";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import Sidebar from "./components/Sidebar";

const prisma = new PrismaClient();

const fetchRestaurantsByLocation = (city: string | undefined) => {
  const select = {
    id: true,
    name: true,
    price: true,
    main_image: true,
    cuisine: true,
    location: true,
    slug: true,
  };

  if (!city) return prisma.restaurant.findMany({ select });

  return prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: city.toLowerCase(),
        },
      },
    },
    select,
  });
};

export default async function Search({
  searchParams: { city },
}: {
  searchParams: { city: string };
}) {
  const restaurants = await fetchRestaurantsByLocation(city);
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <Sidebar />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)
          ) : (
            <p>Sorry, we found no restaurants in this area</p>
          )}
        </div>
      </div>
    </>
  );
}
