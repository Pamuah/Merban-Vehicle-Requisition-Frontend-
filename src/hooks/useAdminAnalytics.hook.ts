import { useState } from "react";
import axios from "axios";
import type {
  DepartmentStats,
  PeakUsageTime,
  TripDuration,
} from "../types/admin.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAdminAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });

  // Get Average Trip Duration
  const fetchAverageTripDuration = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        data: TripDuration;
      }>(
        `${BASE_URL}/api/admin/analytics/average-trip-duration`,
        getAuthHeader()
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch average trip duration";
      setError(message);
      console.error("Average trip duration error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get Department Usage Stats
  const fetchDepartmentUsage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        data: DepartmentStats[];
      }>(`${BASE_URL}/api/admin/analytics/department-usage`, getAuthHeader());

      return response.data.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch department usage stats";
      setError(message);
      console.error("Department usage error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get Peak Usage Times
  const fetchPeakUsageTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        data: PeakUsageTime[];
      }>(`${BASE_URL}/api/admin/analytics/peak-usage-times`, getAuthHeader());

      return response.data.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch peak usage times";
      setError(message);
      console.error("Peak usage times error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchAverageTripDuration,
    fetchDepartmentUsage,
    fetchPeakUsageTimes,
  };
};
