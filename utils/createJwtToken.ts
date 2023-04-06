import { User } from "@prisma/client";
import * as jose from "jose";

export const createJwtToken = async (user: Pick<User, "email" | "id">) => {
  const alg = "HS256";
  const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

  return await new jose.SignJWT({
    id: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg })
    .setExpirationTime("1h")
    .sign(secret);
};
