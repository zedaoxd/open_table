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

type BodyParams = {
  bookerEmail: string;
  bookerPhone: string;
  bookerFirstName: string;
  bookerLastName: string;
  bookerOccasion: string;
  bookerRequest: string;
};

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2021-08-01&time=18:00&partySize=2

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, day, time, partySize } = req.query as QueryParams;
  const {
    bookerEmail,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerPhone,
    bookerRequest,
  } = req.body as BodyParams;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
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

  const tablesToBook: number[] = [];
  let seatsRemaining = Number(partySize);

  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3) {
      if (tablesCount[4].length > 0) {
        tablesToBook.push(tablesCount[4].shift() as number);
        seatsRemaining -= 4;
      } else {
        tablesToBook.push(tablesCount[2].shift() as number);
        seatsRemaining -= 2;
      }
    } else {
      if (tablesCount[2].length > 0) {
        tablesToBook.push(tablesCount[2].shift() as number);
        seatsRemaining -= 2;
      } else {
        tablesToBook.push(tablesCount[4].shift() as number);
        seatsRemaining -= 4;
      }
    }
  }

  const booking = await prisma.booking.create({
    data: {
      number_of_people: Number(partySize),
      booking_time: new Date(`${day}T${time}`),
      booker_email: bookerEmail,
      booker_phone: bookerPhone,
      booker_first_name: bookerFirstName,
      booker_last_name: bookerLastName,
      booker_occasion: bookerOccasion,
      booker_request: bookerRequest,
      restaurant_id: restaurant.id,
    },
  });

  await prisma.bookingsOnTables.createMany({
    data: tablesToBook.map((tableId) => ({
      booking_id: booking.id,
      table_id: tableId,
    })),
  });

  res.status(200).json(booking);
}
