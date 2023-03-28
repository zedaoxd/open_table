import { Cuisine, Location, Price, PrismaClient } from "@prisma/client";
import React from "react";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import Sidebar from "./components/Sidebar";

const prisma = new PrismaClient();

interface ISearchParams {
  city?: string;
  cuisine?: string;
  price?: Price;
}

const fetchRestaurants = (searchParams: ISearchParams) => {
  const where: any = {};

  if (searchParams.city) {
    where.location = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    };
  }

  if (searchParams.cuisine) {
    where.cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
  }

  if (searchParams.price) {
    where.price = {
      equals: searchParams.price,
    };
  }

  const select = {
    id: true,
    name: true,
    price: true,
    main_image: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  return prisma.restaurant.findMany({
    where,
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
  searchParams: ISearchParams;
}) {
  const restaurants = await fetchRestaurants(searchParams);
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
