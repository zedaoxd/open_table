import axios from "axios";
import { useState } from "react";
import { Time } from "../utils/convertToDisplayTime";

type Props = {
  slug: string;
  day: string;
  time: string;
  partySize: number;
};

type Availabity = {
  time: Time;
  available: boolean;
};

export default function useAvailabities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Availabity[] | null>(null);

  const fetchAvailabities = async ({ day, partySize, slug, time }: Props) => {
    setLoading(true);

    try {
      const response = await axios.get<Availabity[]>(
        `/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            partySize,
            time,
          },
        }
      );
      setData(response.data);
    } catch (e: any) {
      setError(e.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    fetchAvailabities,
  };
}
