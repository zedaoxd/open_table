import React from "react";
import Form from "./components/Form";
import Header from "./components/Header";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

const fecthRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }
  return restaurant;
};

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    date: string;
    partySize: string;
  };
};

export default async function Reserve({ params, searchParams }: Props) {
  const restaurant = await fecthRestaurantBySlug(params.slug);
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={restaurant.main_image}
          name={restaurant.name}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
        <Form />
      </div>
    </div>
  );
}
