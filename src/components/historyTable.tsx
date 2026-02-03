import React from "react";
import { useRequestHistory } from "../hooks/requestHistory.hook";

export const StatusBadge = ({ status }: { status: string }) => {
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
    <span className={`${base} ${colors[status] || "bg-gray-500"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

const ITEMS_PER_PAGE = 10;

const RequestHistoryTable = () => {
  const { requests, loading, error } = useRequestHistory();
  const [currentPage, setCurrentPage] = React.useState(1);

  if (loading) return <p>Loading request history...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (requests.length === 0) return <p>No requests found.</p>;

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-green-100 text-green-700">
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">
              Departure - Arrival
            </th>
            <th className="border border-gray-300 px-4 py-2">Destination</th>
            <th className="border border-gray-300 px-4 py-2">Purpose</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Requested At</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((req) => (
            <tr
              key={req._id}
              className="text-center hover:bg-gray-100 transition"
            >
              <td className="border border-gray-300 px-4 py-2">{req.date}</td>

              <td className="border border-gray-300 px-4 py-2">
                {req.departure_time} - {req.estimated_arrival_time}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {req.destination}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {req.purpose}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <StatusBadge status={req.status} />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {new Date(req.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goPrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Previous
        </button>

        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>

        <button
          onClick={goNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default RequestHistoryTable;
