import { useState } from "react";
import axios from "axios";
import type {
  NewRequestData,
  NewRequestResponse,
} from "../types/vehicleRequest.types";

export const useVehicleRequest = () => {
  const [data, setData] = useState<NewRequestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const createRequest = async (payload: NewRequestData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post<NewRequestResponse>(
        `${BASE_URL}/api/vehicle-requests`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
      return response.data; 
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createRequest, data, loading, error };
};
