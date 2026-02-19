import { useState, useCallback } from "react";
import axios from "axios";
import type {
  AfterTripCheckPayload,
  VehicleRequest,
} from "../types/security.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSecurityReturnCheck = () => {
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<VehicleRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchRequest = useCallback(async (requestId: string) => {
    if (!requestId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get<{ data: VehicleRequest }>(
        `${BASE_URL}/api/security/request/${requestId}`,
        getAuthHeader(),
      );

      setRequest(res.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;
      setError(message || "Failed to fetch request");
      console.error("Fetch request error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAfterTrip = async (
    requestId: string,
    payload: AfterTripCheckPayload,
  ) => {
    if (!requestId) throw new Error("No request selected");

    try {
      setLoading(true);
      setError(null);

      await axios.put(
        `${BASE_URL}/api/security/check-in/${requestId}`,
        payload,
        getAuthHeader(),
      );

      await fetchRequest(requestId);
      return true;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An unknown error occurred";

      console.error("Submit after trip error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    request,
    error,
    submitAfterTrip,
    fetchRequest,
  };
};
