import React from "react";
import { FiCheck, FiX } from "react-icons/fi";
import type { ApprovalTableProps, Request } from "../types/approval.types";

const StatusBadge = ({ status }: { status: string }) => {
  const base =
    "px-3 py-1.5 rounded-full text-gray-700 text-xs font-semibold shadow-sm";

  const colors: Record<string, string> = {
    PENDING_MANAGER: "bg-yellow-100",
    PENDING_HR: "bg-orange-200",
    COMPLETED: "bg-green-200",
    REJECTED_MANAGER: "bg-red-300",
    REJECTED_HR: "bg-red-300",
  };

  return (
    <span className={`${base} ${colors[status] || "bg-gray-400"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

const ITEMS_PER_PAGE = 10;

const ApprovalTable: React.FC<ApprovalTableProps> = ({
  items,
  onApprove,
  onReject,
  showActions = true,
  onRowClick,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  if (!items || items.length === 0) {
    return <p>No pending approvals found.</p>;
  }

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-green-100 text-green-700">
            <th className="border px-4 py-2">Staff Name</th>
            <th className="border px-4 py-2">Requested At</th>
            <th className="border px-4 py-2">Departure - Arrival</th>
            <th className="border px-4 py-2">Destination</th>
            <th className="border px-4 py-2">Purpose</th>
            <th className="border px-4 py-2">Status</th>

            {showActions && <th className="border px-4 py-2">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {currentItems.map((req: Request) => (
            <tr
              key={req._id}
              className={`text-center hover:bg-gray-100 ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (!onRowClick) return;
                onRowClick(req);
              }}
            >
              <td className="border px-4 py-2">{req.requestor?.name}</td>
              <td className="border px-4 py-2">
                {new Date(req.createdAt).toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                {req.departure_time} - {req.estimated_arrival_time}
              </td>
              <td className="border px-4 py-2">{req.destination}</td>
              <td className="border px-4 py-2">{req.purpose}</td>
              <td className="border px-4 py-2">
                <StatusBadge status={req.status} />
              </td>

              {showActions && (
                <td className="border px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => onApprove?.(req._id)}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                  >
                    <FiCheck /> Approve
                  </button>

                  <button
                    onClick={() => onReject?.(req._id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    <FiX /> Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Previous
        </button>

        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default ApprovalTable;
