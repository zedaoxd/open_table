import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type QueryParams = {
  slug: string;
  day: string;
  time: string;
  partySize: string;
};

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2021-08-01&time=18:00&partySize=2

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, day, time, partySize } = req.query as QueryParams;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
  });

  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return res.status(422).json({ error: "Invalid time" });
  }

  res.status(200).json({ slug, day, time, partySize });
}
