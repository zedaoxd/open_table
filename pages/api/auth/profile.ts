import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baererToken = req.headers.authorization as string;
  const token = baererToken.split(" ")[1];
  const payload = jwt.decode(token) as Pick<User, "id">;

  if (!payload.id) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      city: true,
      phone: true,
    },
  });

  return res.status(200).json({ user });
}
