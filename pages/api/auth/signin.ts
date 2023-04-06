import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import { createJwtToken } from "../../../utils/createJwtToken";

const prisma = new PrismaClient();

export default async function Signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const errors: string[] = [];
    const { email, password } = req.body;

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isLength(password, {
          min: 1,
        }),
        errorMessage: "Password is invalid",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(422).json({ errors });
    }

    const userWithEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userWithEmail) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userWithEmail.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ errors: ["Email or password is invalid"] });
    }

    const token = await createJwtToken(userWithEmail);

    return res.status(200).json({ token });
  }

  return res.status(404).json({ message: "Not Found" });
}
