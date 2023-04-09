import { NextApiRequest, NextApiResponse } from "next";

type QueryParams = {
  slug: string;
  day: string;
  time: string;
  partySize: string;
};

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2021-08-01&time=18:00&numberOfPerple=2

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, day, time, partySize } = req.query as QueryParams;

  res.status(200).json({ slug, day, time, partySize });
}
