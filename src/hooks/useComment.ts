import { useState } from "react";
import axios, { AxiosError } from "axios";
import type {
  ApiError,
  CommentData,
  CommentFilters,
} from "../types/comment.type";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useComments = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitComment = async (commentData: CommentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/comments/submit`,
        commentData,
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message || "Failed to submit comment",
      );
      throw err;
    }
  };
  const getAllComments = async (filters: CommentFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(`${BASE_URL}/api/comments/all`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message || "Failed to fetch comments",
      );
      throw err;
    }
  };

  const updateCommentStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.patch(
        `${BASE_URL}/api/comments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message || "Failed to update comment",
      );
      throw err;
    }
  };

  const deleteComment = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.delete(`${BASE_URL}/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message || "Failed to delete comment",
      );
      throw err;
    }
  };

  return {
    submitComment,
    getAllComments,
    updateCommentStatus,
    deleteComment,
    loading,
    error,
  };
};
