import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baererToken = req.headers.authorization;

  if (!baererToken) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }

  const token = baererToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const verified = await jose.jwtVerify(token, secret);
    const payload = verified.payload as Pick<User, "id" | "email">;

    if (!payload) {
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
  } catch (error) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }
}
