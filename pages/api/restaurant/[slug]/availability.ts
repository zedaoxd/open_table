import { NextApiRequest, NextApiResponse } from "next";

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
  const { slug, day, time, partySize } = req.query as QueryParams;

  if (!day || !time || !partySize) {
    return res.status(422).json({ errors: ["Missing query params"] });
  }

  return res.status(200).json({ slug, day, time, partySize });
}

// http://localhost:3000/api/restaurant/coconut-lagoon-ottawa/availability
