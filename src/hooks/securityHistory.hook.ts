import { useState, useEffect } from "react";
import axios from "axios";
import type { SecurityHistoryItem } from "../types/security.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSecurityHistory = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SecurityHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get<{
        success: boolean;
        data: SecurityHistoryItem[];
      }>(`${BASE_URL}/api/security/history`, getAuthHeader());

      setHistory(res.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;
      setError(message || "Failed to fetch vehicle history");
      console.error("Fetch history error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    loading,
    history,
    error,
    refresh: fetchHistory,
  };
};
