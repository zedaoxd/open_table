import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import { PrismaClient } from "@prisma/client";

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

  const searchTimes = times.find((t) => t.time === time)?.searchTimes;

  if (!searchTimes) {
    return res.status(422).json({ error: "Invalid time" });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  return res.status(200).json({ searchTimes, bookings });
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability
