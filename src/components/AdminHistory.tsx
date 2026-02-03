// pages/AdminCheckHistory.tsx
import React from "react";
import { useAdminCheckHistory } from "../hooks/admin.History";

export const AdminCheckHistory: React.FC = () => {
  const { history, loading, error, pagination, filters, setFilters, refetch } =
    useAdminCheckHistory({ page: 1, limit: 50 });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading check history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button
          onClick={refetch}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Check-In/Out History</h2>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value, page: 1 })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-2xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value, page: 1 })
              }
              className="w-full border border-gray-300  px-3 py-2 rounded-2xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <select
              value={filters.department || ""}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value, page: 1 })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-2xl"
            >
              <option value="">All Departments</option>
              <option value="Executives">Executives</option>
              <option value="I.T">I.T</option>
              <option value="Human Resource & Admin">
                Human Resource & Admin
              </option>
              <option value="Mutual Funds">Mutual Funds</option>
              <option value="Wealth Management">Wealth Management</option>
              <option value="Corp, Finance & Research">
                Corp, Finance & Research
              </option>
              <option value="Pensions & Institutional Funds">
                Pensions & Institutional Funds
              </option>
              <option value="Gov Securities & Trading">
                Gov Securities & Trading
              </option>
              <option value="Accounts">Accounts</option>
              <option value="Marketing/ Client Services">
                Marketing/ Client Services
              </option>

              <option value="UMB StockBrokers">UMB StockBrokers</option>
              <option value="Compliance">Compliance</option>
              <option value="SDSL">SDSL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-2xl"
            >
              <option value="">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setFilters({ page: 1, limit: 50 })}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
          <button
            onClick={refetch}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-green-300">
            <tr>
              <th className="border px-4 py-3 text-left">Requestor</th>
              <th className="border px-4 py-3 text-left">Department</th>
              <th className="border px-4 py-3 text-left">Vehicle</th>
              <th className="border px-4 py-3 text-left">Destination</th>
              <th className="border px-4 py-3 text-left">Check Out</th>
              <th className="border px-4 py-3 text-left">Check In</th>
              <th className="border px-4 py-3 text-left">Status</th>
              <th className="border px-4 py-3 text-left">Assigned Driver</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No check history found
                </td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="font-medium">{record.requestor?.name}</div>
                    <div className="text-sm text-gray-500">
                      {record.requestor?.email}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {record.requestor_department}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {record.security_check?.before?.car_assigned ? (
                      <div>
                        <div className="font-medium">
                          {record.security_check.before.car_assigned}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {record.destination}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {record.security_check?.before?.timestamp ? (
                      <div>
                        <div>
                          {new Date(
                            record.security_check.before.timestamp,
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(
                            record.security_check.before.timestamp,
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {record.security_check?.after?.timestamp ? (
                      <div>
                        <div>
                          {new Date(
                            record.security_check.after.timestamp,
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(
                            record.security_check.after.timestamp,
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : record.status === "CHECKED_OUT"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {record?.driver_assigned || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {history.length} of {pagination.totalRecords} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({ ...filters, page: (filters.page || 1) - 1 })
              }
              disabled={(filters.page || 1) <= 1}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setFilters({ ...filters, page: (filters.page || 1) + 1 })
              }
              disabled={(filters.page || 1) >= pagination.totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
