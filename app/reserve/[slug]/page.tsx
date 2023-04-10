import React from "react";
import Form from "./components/Form";
import Header from "./components/Header";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Reserve",
  description: "Reserve a table at a restaurant",
};

export default async function Reserve({ params, searchParams }: Props) {
  const restaurant = await fecthRestaurantBySlug(params.slug);
  const [day, time] = searchParams.date.split("T");
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={restaurant.main_image}
          name={restaurant.name}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
        <Form
          day={day}
          slug={params.slug}
          partySize={searchParams.partySize}
          time={time}
        />
      </div>
    </div>
  );
}
