import axios from "axios";
import { useState } from "react";

type Props = {
  slug: string;
  day: string;
  time: string;
  partySize: number;
  body: {
    bookerEmail: string;
    bookerPhone: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerOccasion?: string;
    bookerRequest?: string;
  };
};

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReservation = async ({
    day,
    partySize,
    slug,
    time,
    body,
  }: Props) => {
    setLoading(true);

    try {
      return await axios.post(
        `http://localhost:3000/api/restaurant/${slug}/reserve`,
        body,
        {
          params: {
            day,
            partySize,
            time,
          },
        }
      );
    } catch (e: any) {
      setError(e.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createReservation,
  };
}
