import axios from "axios";
import { useState } from "react";

type Props = {
  slug: string;
  day: string;
  time: string;
  partySize: string;
};

export default function useAvailabities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const fetchAvailabities = async ({ day, partySize, slug, time }: Props) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability`,
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
