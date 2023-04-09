import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

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
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
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

  const searchTimesWithTables = await findAvailableTables({
    time,
    day,
    res,
    restaurant,
  });

  if (!searchTimesWithTables) {
    return res.status(400).json({ error: "Invalid data provided" });
  }

  const searchTimeWithTables = searchTimesWithTables.find(
    (t) => t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
  );

  if (!searchTimeWithTables) {
    return res.status(400).json({ error: "No availability, cannot book" });
  }

  const tablesCount: {
    2: number[];
    4: number[];
  } = {
    2: [],
    4: [],
  };

  searchTimeWithTables.tables.forEach((table) => {
    if (table.seats === 2) tablesCount[2].push(table.id);
    if (table.seats === 4) tablesCount[4].push(table.id);
  });

  res.status(200).json({ tablesCount });
}
