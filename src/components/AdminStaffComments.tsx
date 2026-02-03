import React, { useEffect, useState } from "react";
import { useComments } from "../hooks/useComment.ts";

interface Comment {
  _id: string;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  comment: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
}

const AdminStaffComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalComments, setTotalComments] = useState<number>(0);
  const { getAllComments, updateCommentStatus, deleteComment, loading, error } =
    useComments();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchComments();
  }, [filter, currentPage]);

  const fetchComments = async () => {
    try {
      const filters: any = {
        limit: ITEMS_PER_PAGE,
        page: currentPage,
      };

      if (filter !== "ALL") {
        filters.status = filter;
      }

      const response = await getAllComments(filters);
      setComments(response.data);
      setTotalPages(response.pagination.pages);
      setTotalComments(response.pagination.total);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateCommentStatus(id, newStatus);
      fetchComments();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(id);
        // If we're on a page that becomes empty after deletion, go to previous page
        if (comments.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchComments();
        }
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    return {
      date: date.toLocaleDateString("en-US", dateOptions),
      time: date.toLocaleTimeString("en-US", timeOptions),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Previous
      </button>,
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded border ${
            currentPage === i
              ? "bg-green-500 text-white border-green-500"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>,
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Next
      </button>,
    );

    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">User Comments</h2>
        <p className="text-gray-600">
          Manage and review user feedback and reports
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {["ALL", "PENDING", "REVIEWED", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{totalComments}</span> comments
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No comments found</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comments.map((comment) => {
                    const { date, time } = formatDateTime(comment.createdAt);
                    return (
                      <tr key={comment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{date}</div>
                          <div className="text-xs text-gray-500">{time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {comment.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {comment.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {comment.department}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md">
                            {comment.comment}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={comment.status}
                            onChange={(e) =>
                              handleStatusChange(comment._id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              comment.status,
                            )}`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="REVIEWED">REVIEWED</option>
                            <option value="RESOLVED">RESOLVED</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, totalComments)}
              </span>{" "}
              of <span className="font-medium">{totalComments}</span> results
            </div>
            <div className="flex gap-2">{renderPagination()}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStaffComments;
