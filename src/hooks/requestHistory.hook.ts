import { useState, useEffect } from "react";
import axios from "axios";
import type { RequestHistoryResponse } from "../types/vehicleRequest.types";

export const useRequestHistory = () => {
  const [requests, setRequests] = useState<RequestHistoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<{
          success: boolean;
          count: number;
          data: RequestHistoryResponse[];
        }>(`${BASE_URL}/api/vehicle-requests/my-requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRequests(response.data.data);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to fetch request history.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return { requests, loading, error };
};
