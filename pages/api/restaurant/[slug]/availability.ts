import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";

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

  const searchTimes = times.find((t) => t.time === time);

  if (!searchTimes) {
    return res.status(422).json({ error: "Invalid time" });
  }

  return res.status(200).json(searchTimes);
}

// http://localhost:3000/api/restaurant/coconut-lagoon-ottawa/availability
