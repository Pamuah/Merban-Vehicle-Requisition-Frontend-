import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type {
  BeforeTripCheckPayload,
  VehicleRequest,
} from "../types/security.types";
import { useSecurityRequest } from "../context/securityRequestContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSecurityCheck = () => {
  const { selected } = useSecurityRequest();
  const requestId = selected?.id ?? "";

  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<VehicleRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Create authHeader as a function to get fresh token each time
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchRequest = useCallback(async () => {
    if (!requestId) return;

    try {
      setLoading(true);
      setError(null); // ✅ Clear previous errors

      const res = await axios.get<{ data: VehicleRequest }>(
        `${BASE_URL}/api/security/request/${requestId}`,
        getAuthHeader() // ✅ Call function to get fresh token
      );

      setRequest(res.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;
      setError(message || "Failed to fetch request");
      console.error("Fetch error:", err); // ✅ Added logging
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const submitBeforeTrip = async (payload: BeforeTripCheckPayload) => {
    if (!requestId) throw new Error("No request selected");

    try {
      setLoading(true);
      setError(null); // ✅ Clear previous errors

      await axios.put(
        `${BASE_URL}/api/security/check-out/${requestId}`,
        payload,
        getAuthHeader() // ✅ Call function to get fresh token
      );

      await fetchRequest();
      return true;
    } catch (err: unknown) {
      // ✅ Better error handling
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An unknown error occurred";

      console.error("Submit error:", err); // ✅ Added logging
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    request,
    error,
    submitBeforeTrip,
    refresh: fetchRequest,
  };
};
