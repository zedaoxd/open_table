"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import useReservation from "../../../../../hooks/useReservation";
import { CircularProgress } from "@mui/material";

const schema = z.object({
  bookerFirstName: z.string().min(1),
  bookerLastName: z.string().min(1),
  bookerPhone: z.string().min(1),
  bookerEmail: z.string().email({ message: "Invalid email address" }),
  bookerOccasion: z.string().optional(),
  bookerRequest: z.string().optional(),
});

type FormType = z.infer<typeof schema>;

type Props = {
  day: string;
  partySize: string;
  time: string;
  slug: string;
};

export default function Form({ day, partySize, slug, time }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<FormType>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
  });

  const { createReservation, error, loading } = useReservation();

  const onSubmit = handleSubmit((data) => {
    try {
      const body = schema.parse(data);
      createReservation({ day, body, partySize, time, slug });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.formErrors);
      }
    }
  });

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      <form onSubmit={onSubmit}>
        <div className="flex gap-3">
          <input
            {...register("bookerFirstName")}
            type="text"
            className={`border rounded p-3 w-80 mb-4 ${
              errors.bookerFirstName ? "border-red-600" : ""
            }`}
            placeholder="First name"
          />

          <input
            {...register("bookerLastName")}
            type="text"
            className={`border rounded p-3 w-80 mb-4 ${
              errors.bookerLastName ? "border-red-600" : ""
            }`}
            placeholder="Last name"
          />
        </div>

        <div className="flex gap-3">
          <input
            {...register("bookerPhone")}
            type="text"
            className={`border rounded p-3 w-80 mb-4 ${
              errors.bookerPhone ? "border-red-600" : ""
            }`}
            placeholder="Phone number"
          />
          <input
            {...register("bookerEmail")}
            type="text"
            className={`border rounded p-3 w-80 mb-4 ${
              errors.bookerEmail ? "border-red-600" : ""
            }`}
            placeholder="Email"
          />
        </div>

        <div className="flex gap-3">
          <input
            {...register("bookerOccasion")}
            type="text"
            className={`border rounded p-3 w-80 mb-4 ${
              errors.bookerOccasion ? "border-red-600" : ""
            }`}
            placeholder="Occasion (optional)"
          />
          <input
            {...register("bookerRequest")}
            type="text"
            className={`border rounded p-3 w-80 mb-4 ${
              errors.bookerRequest ? "border-red-600" : ""
            }`}
            placeholder="Requests (optional)"
          />
        </div>
        <button
          disabled={!isValid || loading}
          className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
        >
          {loading ? (
            <CircularProgress color="inherit" />
          ) : (
            "Complete reservation"
          )}
        </button>
        <p className="mt-4 text-sm">
          By clicking “Complete reservation” you agree to the OpenTable Terms of
          Use and Privacy Policy. Standard text message rates may apply. You may
          opt out of receiving text messages at any time.
        </p>
      </form>
    </div>
  );
}
