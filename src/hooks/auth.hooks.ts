import { useState } from "react";
import axios from "axios";
import type {
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
} from "../types/auth.types";

export const useAuth = () => {
  const [user, setUser] = useState<LoginResponse | RegisterResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ---------- LOGIN ----------
  const login = async (credentials: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/api/auth/login`,
        credentials,
      );

      const loggedInUser = response.data;

      console.log("✅ Login successful - Full response:", loggedInUser);
      console.log("📧 Name:", loggedInUser.name);
      console.log("📧 Email:", loggedInUser.email);
      console.log("🏢 Department:", loggedInUser.department);
      console.log("🆔 User ID:", loggedInUser._id);
      console.log("👤 Role:", loggedInUser.role);

      setUser(loggedInUser);
      localStorage.setItem("token", loggedInUser.token);
      localStorage.setItem("role", loggedInUser.role.toLowerCase());

      const userDataToSave = {
        name: loggedInUser.name,
        email: loggedInUser.email,
        department: loggedInUser.department,
        _id: loggedInUser._id,
      };

      console.log("💾 Data being saved to localStorage:", userDataToSave);

      localStorage.setItem("user", JSON.stringify(userDataToSave));

      // Verify what was actually saved
      const savedUser = localStorage.getItem("user");
      console.log("✅ Data saved in localStorage (raw):", savedUser);
      console.log(
        "✅ Data saved in localStorage (parsed):",
        JSON.parse(savedUser || "{}"),
      );

      return loggedInUser;
    } catch (err: unknown) {
      console.error("❌ Login error:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Login failed. Please try again.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- REGISTER ----------
  const register = async (formData: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<RegisterResponse>(
        `${BASE_URL}/api/auth/register`,
        formData,
      );

      const registeredUser = response.data;
      setUser(registeredUser);
      localStorage.setItem("token", registeredUser.token);

      return registeredUser;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- LOGOUT ----------
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, login, register, logout, loading, error };
};
