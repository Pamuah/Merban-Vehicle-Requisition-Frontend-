import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Vehicle {
  _id: string;
  plate_number: string;
  make: string;
  model: string;
  year?: number;
  status: string;
  current_mileage: number;
}

export const useAvailableVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchAvailableVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch only AVAILABLE vehicles
      const response = await axios.get<{
        success: boolean;
        count: number;
        data: Vehicle[];
      }>(`${BASE_URL}/api/vehicles?status=AVAILABLE`, getAuthHeader());

      setVehicles(response.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch vehicles";
      setError(message);
      console.error("Fetch vehicles error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    refresh: fetchAvailableVehicles,
  };
};
