import { useState, useMemo } from "react";
import { useSecurityHistory } from "../hooks/securityHistory.hook.ts";

const VehicleHistoryTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { loading, history, error } = useSecurityHistory();

  // Transform data to include both check-out and check-in records
  const transformedHistory = useMemo(() => {
    const records: any[] = [];

    history.forEach((request) => {
      // Add check-out record if it exists
      if (request.security_check?.before) {
        records.push({
          id: `${request._id}-checkout`,
          requestId: request._id,
          requestorName: request.requestor?.name || "N/A",
          dateTime: new Date(request.updatedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          plate: request.security_check.before.car_assigned || "N/A",
          action: "Check-out",
          mileage: `${request.security_check.before.mileage_before} km`,
          fuel: `${request.security_check.before.fuel_level_before}%`,
          notes:
            request.security_check.before.condition_comment_before ||
            "No notes provided",
          rawDate: new Date(request.updatedAt),
        });
      }

      // Add check-in record if it exists
      if (request.security_check?.after) {
        records.push({
          id: `${request._id}-checkin`,
          requestId: request._id,
          requestorName: request.requestor?.name || "N/A",
          dateTime: new Date(request.updatedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          plate: request.security_check.after.car_assigned || "N/A",
          action: "Check-in",
          mileage: `${request.security_check.after.mileage_after} km`,
          fuel: `${request.security_check.after.fuel_level_after}%`,
          notes:
            request.security_check.after.condition_comment_after ||
            "No notes provided",
          rawDate: new Date(request.updatedAt),
        });
      }
    });

    // Sort by date (newest first)
    return records.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  }, [history]);

  // Filter data
  const filteredHistory = useMemo(() => {
    return transformedHistory.filter((record) => {
      const matchesSearch = record.plate
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterAction === "all" ||
        record.action.toLowerCase() === filterAction.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [transformedHistory, searchQuery, filterAction]);

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-800 p-8 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-slate-800 p-8 rounded-lg">
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-800 px-8 rounded-lg">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Vehicle History Log
        </h2>
        <p className="text-slate-400">
          View past check-in and check-out records.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by number plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Actions</option>
          <option value="check-in">Check-in</option>
          <option value="check-out">Check-out</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700/50">
              <th className="text-left text-slate-300 font-semibold py-4 px-4 text-sm uppercase tracking-wider">
                Requestor
              </th>
              <th className="text-left text-slate-300 font-semibold py-4 px-4 text-sm uppercase tracking-wider">
                Date & Time
              </th>
              <th className="text-left text-slate-300 font-semibold py-4 px-4 text-sm uppercase tracking-wider">
                Vehicle Plate
              </th>
              <th className="text-left text-slate-300 font-semibold py-4 px-4 text-sm uppercase tracking-wider">
                Action
              </th>
              <th className="text-left text-slate-300 font-semibold py-4 px-4 text-sm uppercase tracking-wider">
                Mileage
              </th>
              <th className="text-left text-slate-300 font-semibold py-4 px-4 text-sm uppercase tracking-wider">
                Fuel
              </th>
              <th className="text-left text-slate-300 font-semibold py-4 px-4 text-sm uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedHistory.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-4 px-4 text-slate-300">
                    {record.requestorName}
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {record.dateTime}
                  </td>
                  <td className="py-4 px-4 text-slate-300">{record.plate}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        record.action === "Check-in"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {record.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{record.mileage}</td>
                  <td className="py-4 px-4 text-slate-300">{record.fuel}</td>
                  <td className="py-4 px-4 text-slate-300 max-w-xs truncate">
                    {record.notes}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-slate-400 text-sm">
          Showing{" "}
          <span className="text-white font-medium">
            {paginatedHistory.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}
            -{Math.min(currentPage * itemsPerPage, filteredHistory.length)}
          </span>{" "}
          of{" "}
          <span className="text-white font-medium">
            {filteredHistory.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {page}
              </button>
            );
          })}
          {totalPages > 5 && (
            <span className="px-3 py-2 text-slate-400">...</span>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistoryTable;
