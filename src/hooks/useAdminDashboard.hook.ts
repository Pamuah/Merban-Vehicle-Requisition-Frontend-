import { useState, useEffect } from "react";
import type { DashboardStats, ApprovalRates } from "../types/admin.types.ts";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [rates, setRates] = useState<ApprovalRates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        data: DashboardStats;
      }>(`${BASE_URL}/api/admin/dashboard/stats`, getAuthHeader());

      setStats(response.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch dashboard stats";
      setError(message);
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovalRates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        data: ApprovalRates;
      }>(`${BASE_URL}/api/admin/dashboard/approval-rates`, getAuthHeader());

      setRates(response.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch approval rates";
      setError(message);
      console.error("Approval rates error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDashboardData = async () => {
    await Promise.all([fetchDashboardStats(), fetchApprovalRates()]);
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  return {
    loading,
    stats,
    rates,
    error,
    refresh: fetchAllDashboardData,
  };
};
