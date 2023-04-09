import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient();

type QueryParams = {
  slug: string;
  day: string;
  time: string;
  partySize: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, day, time, partySize } = req.query as QueryParams;

  if (!day || !time || !partySize) {
    return res.status(422).json({ error: "Missing query params" });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }

  const searchTimesWithTables = await findAvailableTables({
    time,
    day,
    res,
    restaurant,
  });

  if (!searchTimesWithTables) {
    return res.status(400).json({ error: "Invalid data provider" });
  }

  const availabilities = searchTimesWithTables
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => sum + table.seats, 0);
      return {
        time: t.time,
        available: sumSeats >= Number(partySize),
      };
    })
    .filter((a) => {
      const timeIsAfterOpenningHour =
        new Date(`${day}T${a.time}`) >=
        new Date(`${day}T${restaurant.open_time}`);
      const timesInBeforeClosingHour =
        new Date(`${day}T${a.time}`) <=
        new Date(`${day}T${restaurant.close_time}`);
      return timeIsAfterOpenningHour && timesInBeforeClosingHour;
    });

  return res.status(200).json(availabilities);
}
