import { useState } from "react";
import axios from "axios";
import type { VehicleRequestStats } from "../types/vehicleRequest.types";

export const useRequestStats = () => {
  const [data, setData] = useState<VehicleRequestStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get<VehicleRequestStats>(
        `${BASE_URL}/api/vehicle-requests/stats`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
      return response.data; // return stats for immediate use
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to load request statistics."
        );
      } else {
        setError("An unexpected error occurred.");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchStats, data, loading, error };
};
