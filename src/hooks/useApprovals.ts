// src/hooks/useApprovals.ts
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { ApprovalRequest } from "../types/approval.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const useApprovals = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const role = localStorage.getItem("role")?.toLowerCase() || "";
  console.log("ROLE →", role);

  const listUrl =
    role === "manager"
      ? `${BASE_URL}/api/manager-approvals/pending`
      : `${BASE_URL}/api/hr-approvals/pending`;

  console.log("LIST URL →", listUrl);
  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<{
        success: boolean;
        count: number;
        data: ApprovalRequest[];
      }>(listUrl, authHeader);
      setApprovals(res.data.data || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message || "Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  }, [listUrl]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const approveRequest = async (id: string) => {
    try {
      const url =
        role === "manager"
          ? `${BASE_URL}/api/manager-approvals/approve/${id}`
          : `${BASE_URL}/api/hr-approvals/approve/${id}`;

      await axios.patch(url, {}, authHeader);
      await fetchApprovals();
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      throw new Error(message || "Failed to approve");
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      const url =
        role === "manager"
          ? `${BASE_URL}/api/manager-approvals/reject/${id}`
          : `${BASE_URL}/api/hr-approvals/reject/${id}`;

      await axios.patch(url, {}, authHeader);
      await fetchApprovals();
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      throw new Error(message || "Failed to reject");
    }
  };

  return {
    approvals,
    loading,
    error,
    approveRequest,
    rejectRequest,
    refresh: fetchApprovals,
  };
};
