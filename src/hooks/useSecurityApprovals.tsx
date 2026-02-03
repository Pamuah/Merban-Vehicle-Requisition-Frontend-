import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useSecurityApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const fetchSecurityApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authorization token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/security/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // IMPORTANT: access response.data.data, not response.data directly
      setRequests(response.data.data || []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const backendMessage =
          err.response?.data?.message || err.message || "Request failed";
        setError(backendMessage);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchSecurityApprovals();
  }, [fetchSecurityApprovals]);

  return {
    requests,
    loading,
    error,
    refresh: fetchSecurityApprovals,
  };
};

export default useSecurityApprovals;
