import React, { useState, useMemo } from "react";
import { useAdminVehicles } from "../hooks/useAdminVehicles.hook";
import type { FuelStats } from "../types/admin.types";
import { FiDownload, FiCalendar } from "react-icons/fi";

const FuelConsumptionReport = () => {
  const { fetchFuelConsumption, loading, error } = useAdminVehicles();
  const [fuelData, setFuelData] = useState<FuelStats[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calculate fleet totals
  const fleetTotals = useMemo(() => {
    if (!fuelData || fuelData.length === 0) {
      return {
        totalVehicles: 0,
        totalFuelConsumed: 0,
        fleetAverage: 0,
        totalTrips: 0,
      };
    }

    const totalVehicles = fuelData.length;

    // Sum of all vehicles' total fuel consumed (in litres)
    const totalFuelConsumed = fuelData.reduce((sum, vehicle) => {
      const litres =
        ((vehicle.totalFuelConsumed || 0) / 100) * (vehicle.tankCapacity || 0);
      return sum + litres;
    }, 0);

    // Total trips across all vehicles
    const totalTrips = fuelData.reduce((sum, f) => sum + f.tripCount, 0);

    // Fleet average = total fuel consumed / total trips
    const fleetAverage = totalTrips > 0 ? totalFuelConsumed / totalTrips : 0;

    return {
      totalVehicles,
      totalFuelConsumed: totalFuelConsumed.toFixed(2),
      fleetAverage: fleetAverage.toFixed(2),
      totalTrips,
    };
  }, [fuelData]);

  const handleGenerateReport = async () => {
    try {
      const data = await fetchFuelConsumption(startDate, endDate);
      setFuelData(data);
    } catch (err) {
      console.error("Failed to generate fuel report:", err);
    }
  };

  const handleExportCSV = () => {
    // Create CSV content with litres
    const headers = [
      "Vehicle Plate",
      "Model",
      "Tank Capacity (L)",
      "Total Fuel Consumed (L)",
      "Average per Trip (L)",
      "Number of Trips",
    ];
    const rows = fuelData.map((f) => [
      f.plateNumber,
      f.model,
      f.tankCapacity,
      ((f.totalFuelConsumed / 100) * f.tankCapacity).toFixed(2),
      ((f.averageFuelConsumption / 100) * f.tankCapacity).toFixed(2),
      f.tripCount,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fuel-consumption-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-500">
          Fuel Consumption Report
        </h2>
        <button
          onClick={handleExportCSV}
          disabled={fuelData.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiDownload />
          Export CSV
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Start Date
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            End Date
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerateReport}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
          >
            Generate Report
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading fuel consumption data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {/* Report Table */}
      {fuelData.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Fuel Consumed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average per Trip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Trips
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fuelData.map((fuel, index) => {
                  // Calculate actual litres consumed
                  const avgLitres =
                    (fuel.averageFuelConsumption / 100) * fuel.tankCapacity;

                  // Calculate efficiency rating based on litres
                  let efficiency = "Excellent";
                  let efficiencyColor = "text-green-600 bg-green-100";

                  if (avgLitres > 30) {
                    efficiency = "Poor";
                    efficiencyColor = "text-red-600 bg-red-100";
                  } else if (avgLitres > 20) {
                    efficiency = "Average";
                    efficiencyColor = "text-yellow-600 bg-yellow-100";
                  } else if (avgLitres > 10) {
                    efficiency = "Good";
                    efficiencyColor = "text-blue-600 bg-blue-100";
                  }

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">
                          {fuel.plateNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">
                          {fuel.model}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-800">
                          {(
                            (fuel.totalFuelConsumed / 100) *
                            fuel.tankCapacity
                          ).toFixed(2)}{" "}
                          litres
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-600">
                          {avgLitres.toFixed(2)} litres
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">
                          {fuel.tripCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${efficiencyColor}`}
                        >
                          {efficiency}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-purple-600">
                {fleetTotals.totalVehicles}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Fuel Consumed</p>
              <p className="text-2xl font-bold text-orange-600">
                {fleetTotals.totalFuelConsumed} L
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Fleet Average</p>
              <p className="text-2xl font-bold text-blue-600">
                {fleetTotals.fleetAverage} L/trip
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-green-600">
                {fleetTotals.totalTrips}
              </p>
            </div>
          </div>

          {/* Most/Least Efficient */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Most Fuel Efficient</p>
              {(() => {
                const mostEfficient = fuelData.reduce((prev, curr) =>
                  prev.averageFuelConsumption < curr.averageFuelConsumption
                    ? prev
                    : curr
                );
                const avgLitres = (
                  (mostEfficient.averageFuelConsumption / 100) *
                  mostEfficient.tankCapacity
                ).toFixed(2);
                return (
                  <>
                    <p className="text-lg font-bold text-green-700">
                      {mostEfficient.plateNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Avg: {avgLitres} litres per trip
                    </p>
                  </>
                );
              })()}
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Least Fuel Efficient</p>
              {(() => {
                const leastEfficient = fuelData.reduce((prev, curr) =>
                  prev.averageFuelConsumption > curr.averageFuelConsumption
                    ? prev
                    : curr
                );
                const avgLitres = (
                  (leastEfficient.averageFuelConsumption / 100) *
                  leastEfficient.tankCapacity
                ).toFixed(2);
                return (
                  <>
                    <p className="text-lg font-bold text-red-700">
                      {leastEfficient.plateNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Avg: {avgLitres} litres per trip
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </>
      )}

      {fuelData.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No data available</p>
          <p className="text-sm">
            Select a date range and click "Generate Report"
          </p>
        </div>
      )}
    </div>
  );
};

export default FuelConsumptionReport;
