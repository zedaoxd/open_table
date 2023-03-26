import { Cuisine, Location, Price, PrismaClient } from "@prisma/client";
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

const fetchAllLocations = (): Promise<Location[]> => {
  return prisma.location.findMany();
};

const fetchAllCuisines = (): Promise<Cuisine[]> => {
  return prisma.cuisine.findMany();
};

export default async function Search({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: Price };
}) {
  const restaurants = await fetchRestaurantsByLocation(searchParams.city);
  const locations = await fetchAllLocations();
  const cuisines = await fetchAllCuisines();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <Sidebar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
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
