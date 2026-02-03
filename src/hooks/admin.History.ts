// hooks/useAdminCheckHistory.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface SecurityCheck {
  before?: {
    car_assigned: string;
    timestamp: string;
    mileage: number;
    fuel_level: string;
    vehicle_condition: string;
    checked_by: string;
  };
  after?: {
    car_assigned: string;
    timestamp: string;
    mileage: number;
    fuel_level: string;
    vehicle_condition: string;
    checked_by: string;
  };
}

interface CheckHistoryRecord {
  _id: string;
  requestor?: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
  car_assigned?: {
    _id: string;
    plateNumber: string;
    model: string;
    make: string;
    year: number;
  };
  requestor_department: string;
  date: string;
  departure_time: string;
  destination: string;
  purpose: string;
  status: string;
  driver_assigned?: string;
  security_check?: SecurityCheck;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
}

interface Filters {
  startDate?: string;
  endDate?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface UseAdminCheckHistoryReturn {
  history: CheckHistoryRecord[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  refetch: () => void;
}

export const useAdminCheckHistory = (
  initialFilters: Filters = { page: 1, limit: 50 },
): UseAdminCheckHistoryReturn => {
  const [history, setHistory] = useState<CheckHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("adminToken") || localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await axios.get(
        `${BASE_URL}/api/admin-history/check-history`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Fetched admin check history:", response.data);
      if (response.data.success) {
        setHistory(response.data.data || []);
        setPagination(response.data.pagination || null);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch check history",
        );
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "An error occurred";

      setError(errorMessage);
      console.error("Error fetching admin check history:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch: fetchHistory,
  };
};
