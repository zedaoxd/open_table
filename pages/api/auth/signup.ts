import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { first_name, last_name, city, password, email, phone } =
      req.body as User;

    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isLength(first_name, {
          min: 1,
          max: 20,
        }),
        errorMessage: "First name is invalid",
      },
      {
        valid: validator.isLength(last_name, {
          min: 1,
          max: 20,
        }),
        errorMessage: "Last name is invalid",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isMobilePhone(phone, "pt-BR"),
        errorMessage: "Phone number is invalid",
      },
      {
        valid: validator.isLength(city, {
          min: 1,
        }),
        errorMessage: "City is invalid",
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: "Password is not strong enough",
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

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        city,
        email,
        phone,
        password: hashedPassword,
      },
    });

    if (userWithEmail) {
      return res.status(422).json({ errors: ["Email already in use"] });
    }

    res.status(201).json({ success: "salvo" });
  }
}