import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

const fetchRestaurants = async () => {
  const restaurants = await Prisma.restaurant.findMany();
  return restaurants;
};

export default async function Home() {
  const restaurants = await fetchRestaurants();
  console.log({ restaurants });
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        <RestaurantCard />
      </div>
    </main>
  );
}
