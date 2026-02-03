import { useState } from "react";
import type { AdminLoginResponse } from "../types/admin.types.ts";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<AdminLoginResponse>(
        `${BASE_URL}/api/admin/login`,
        { username, password }
      );

      // Store token in localStorage
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data.user));

      console.log("✅ Admin login successful");
      return response.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Admin login failed";

      setError(message);
      console.error("❌ Admin login error:", err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    console.log("✅ Admin logged out");
  };

  const isAdminAuthenticated = () => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");
    return !!(token && user);
  };

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  return {
    loading,
    error,
    adminLogin,
    adminLogout,
    isAdminAuthenticated,
    getAdminToken,
  };
};
