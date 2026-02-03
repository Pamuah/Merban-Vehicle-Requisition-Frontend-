import { useState } from "react";
import axios from "axios";
import type {
  Vehicle,
  VehicleInUse,
  TripStats,
  MostRequestedVehicle,
  FuelStats,
} from "../types/admin.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAdminVehicles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });

  // Get Available Vehicles
  const fetchAvailableVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        data: Vehicle[];
        count: number;
      }>(`${BASE_URL}/api/admin/vehicles/available`, getAuthHeader());

      return response.data.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch available vehicles";
      setError(message);
      console.error("Available vehicles error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get Vehicles In Use
  const fetchVehiclesInUse = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        data: VehicleInUse[];
        count: number;
      }>(`${BASE_URL}/api/admin/vehicles/in-use`, getAuthHeader());

      return response.data.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch vehicles in use";
      setError(message);
      console.error("Vehicles in use error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get Trips Per Vehicle
  const fetchTripsPerVehicle = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axios.get<{
        success: boolean;
        data: TripStats[];
      }>(
        `${BASE_URL}/api/admin/vehicles/trips-per-vehicle?${params.toString()}`,
        getAuthHeader()
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch trips per vehicle";
      setError(message);
      console.error("Trips per vehicle error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get Fuel Consumption Report
  const fetchFuelConsumption = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axios.get<{
        success: boolean;
        data: FuelStats[];
      }>(
        `${BASE_URL}/api/admin/vehicles/fuel-consumption?${params.toString()}`,
        getAuthHeader()
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch fuel consumption";
      setError(message);
      console.error("Fuel consumption error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get Most Requested Vehicles
  const fetchMostRequestedVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        data: MostRequestedVehicle[];
      }>(`${BASE_URL}/api/admin/vehicles/most-requested`, getAuthHeader());

      return response.data.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch most requested vehicles";
      setError(message);
      console.error("Most requested vehicles error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchAvailableVehicles,
    fetchVehiclesInUse,
    fetchTripsPerVehicle,
    fetchFuelConsumption,
    fetchMostRequestedVehicles,
  };
};
