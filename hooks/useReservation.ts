import axios from "axios";
import { useState } from "react";

type Props = {
  slug: string;
  day: string;
  time: string;
  partySize: string;
  body: {
    bookerFirstName: string;
    bookerLastName: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOccasion?: string | undefined;
    bookerRequest?: string | undefined;
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
      return await axios.post(`/api/restaurant/${slug}/reserve`, body, {
        params: {
          day,
          partySize,
          time,
        },
      });
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
