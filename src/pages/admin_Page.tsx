import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/dashboardCard";
import {
  FiUsers,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiLogOut,
  FiActivity,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";
import { useAdminDashboard } from "../hooks/useAdminDashboard.hook";
import { useAdminVehicles } from "../hooks/useAdminVehicles.hook";
import { useAdminAnalytics } from "../hooks/useAdminAnalytics.hook";
import { useAdminAuth } from "../hooks/auth.Admin.hook";
import DepartmentUsageChart from "../components/general/DeptUsageChart";
import FuelConsumptionReport from "../components/FuelReport";
import AdminSideNav from "../components/adminSideNav";
import AdminCard from "../components/AdminCard";
import bgAdmin from "../assets/bg-admin2.jpg";
import AdminTile from "../components/AdminTile";
import VehicleVisualization from "../components/vehicleVIsualizationProp";

const AdminPage = () => {
  const navigate = useNavigate();
  const { adminLogout } = useAdminAuth();

  // Dashboard stats
  const {
    loading: dashboardLoading,
    stats,
    rates,
    error: dashboardError,
  } = useAdminDashboard();

  // Vehicle hooks
  const {
    loading: vehicleLoading,
    fetchAvailableVehicles,
    fetchVehiclesInUse,
    fetchMostRequestedVehicles,
    error: vehicleError,
  } = useAdminVehicles();

  // Analytics hooks
  const {
    loading: analyticsLoading,
    fetchAverageTripDuration,
    fetchPeakUsageTimes,
    error: analyticsError,
  } = useAdminAnalytics();

  // Local state for vehicle and analytics data
  const [availableVehiclesCount, setAvailableVehiclesCount] =
    useState<number>(0);
  const [vehiclesInUseCount, setVehiclesInUseCount] = useState<number>(0);
  const [mostRequestedVehicle, setMostRequestedVehicle] =
    useState<string>("--");
  const [avgTripDuration, setAvgTripDuration] = useState<string>("--");
  const [peakUsageTime, setPeakUsageTime] = useState<string>("--");

  const [showUsageAnalytics, setShowUsageAnalytics] = useState(true);
  const [showDepartmentStats, setShowDepartmentStats] = useState(false);
  const [showFuelReport, setShowFuelReport] = useState(false);

  const [availableVehiclesData, setAvailableVehiclesData] = useState<
    {
      plate_number: string;
      color: string;
    }[]
  >([]);
  const [vehiclesInUseData, setVehiclesInUseData] = useState<
    { plate_number: string; color: string }[]
  >([]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Define color palette
        const colors = [
          "#8B5CF6", // Purple
          "#3B82F6", // Blue
          "#10B981", // Green
          "#F59E0B", // Amber
          "#EF4444", // Red
          "#EC4899", // Pink
          "#06B6D4", // Cyan
          "#8B5CF6", // Purple (repeat if more vehicles)
        ];

        // Fetch available vehicles
        const availableVehicles = await fetchAvailableVehicles();
        setAvailableVehiclesCount(availableVehicles.length);

        // Map available vehicles to include colors
        const availableWithColors = availableVehicles.map(
          (vehicle: any, index: number) => ({
            plate_number: vehicle.plate_number,
            color: colors[index % colors.length],
          })
        );
        setAvailableVehiclesData(availableWithColors);

        // Fetch vehicles in use
        const vehiclesInUse = await fetchVehiclesInUse();
        setVehiclesInUseCount(vehiclesInUse.length);

        // Map in-use vehicles to include colors
        const inUseWithColors = vehiclesInUse.map(
          (vehicle: any, index: number) => ({
            plate_number: vehicle.plate_number,
            color: colors[index % colors.length],
          })
        );
        setVehiclesInUseData(inUseWithColors);

        // Fetch most requested vehicles
        const mostRequested = await fetchMostRequestedVehicles();
        if (mostRequested.length > 0) {
          setMostRequestedVehicle(
            `${mostRequested[0].plateNumber} (${mostRequested[0].requestCount})`
          );
        }

        // Fetch average trip duration
        const tripDuration = await fetchAverageTripDuration();
        setAvgTripDuration(`${tripDuration.averageDurationHours}h`);

        // Fetch peak usage times
        const peakTimes = await fetchPeakUsageTimes();
        if (peakTimes.length > 0) {
          setPeakUsageTime(`${peakTimes[0].dayOfWeek} ${peakTimes[0].hour}`);
        }
      } catch (error) {
        console.error("Error fetching additional data:", error);
      }
    };

    fetchAdditionalData();
  }, []);
  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };

  const isLoading = dashboardLoading || vehicleLoading || analyticsLoading;
  const hasError = dashboardError || vehicleError || analyticsError;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <AdminSideNav />

      {/* Main Content Area with left margin for sidebar */}
      <div className="ml-64">
        {/* Fixed Top Navbar */}
        <div className="fixed top-0 right-0 left-64 bg-white shadow-md h-16 flex items-center px-6 z-30">
          <p className="text-green-500 font-semibold text-2xl">Dashboard</p>
        </div>

        {/* Scrollable Content Area with top padding for navbar */}
        <div className="pt-16 px-8 pb-8">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="text-green-700 text-xl animate-pulse">
                Loading dashboard data...
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong>Error:</strong>{" "}
              {dashboardError || vehicleError || analyticsError}
            </div>
          )}

          {/* Dashboard Content */}
          {!isLoading && !hasError && (
            <>
              {/* Overview Statistics Section - Always Visible */}
              <div
                className="mb-6 mt-10 p-8 bg-white rounded-3xl shadow-md bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bgAdmin})` }}
              >
                <h2 className="text-lg font-semibold text-gray-400 mb-8 flex items-center gap-2">
                  <FiPieChart className="text-green-600" />
                  Overview Statistics
                </h2>

                <div className="grid grid-cols-5 gap-4">
                  <AdminCard
                    title="Total Users"
                    value={stats?.totalUsers?.toString() || "0"}
                    icon={FiUsers}
                  />
                  <AdminCard
                    title="Total Requests"
                    value={rates?.totalRequests?.toString() || "0"}
                    icon={FiActivity}
                  />
                  <AdminCard
                    title="Ongoing Trips"
                    value={stats?.ongoingTrips?.toString() || "0"}
                    icon={FiTruck}
                  />
                  <AdminCard
                    title="Today's Checkouts"
                    value={stats?.todaysCheckouts?.toString() || "0"}
                    icon={FiCheckCircle}
                  />
                  <AdminCard
                    title="Today's Check-ins"
                    value={stats?.todaysCheckins?.toString() || "0"}
                    icon={FiCheckCircle}
                  />
                  {/* <DashboardCard
                    title="Pending Approvals"
                    value={stats?.pendingApprovals?.toString() || "0"}
                    icon={FiClock}
                  />
                  <DashboardCard
                    title="Total Rejections"
                    value={stats?.totalRejections?.toString() || "0"}
                    icon={FiXCircle}
                  />
                  <DashboardCard
                    title="Completed Trips"
                    value={stats?.completedTrips?.toString() || "0"}
                    icon={FiCheckCircle}
                  />
                  <DashboardCard
                    title="Approval Rates"
                    value={`${rates?.approvalRate?.toFixed(1) || "0"}%`}
                    icon={FiTrendingUp}
                  /> */}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <AdminTile
                    title="Available Vehicles"
                    value={availableVehiclesCount.toString()}
                    icon={FiTruck}
                  >
                    <VehicleVisualization vehicles={availableVehiclesData} />
                  </AdminTile>
                  <AdminTile
                    title="Vehicles In-Use"
                    value={vehiclesInUseCount.toString()}
                    icon={FiTruck}
                  >
                    <VehicleVisualization vehicles={vehiclesInUseData} />
                  </AdminTile>
                  <AdminTile
                    title="Most Requested Vehicle"
                    value={mostRequestedVehicle}
                    icon={FiAward}
                  />
                </div>
              </div>

              {/* Usage Analytics Section - Collapsible */}
              {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setShowUsageAnalytics(!showUsageAnalytics)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FiBarChart2 className="text-green-600 text-xl" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Usage Analytics
                      </h3>
                      <p className="text-sm text-gray-500">
                        Trip duration and peak usage insights
                      </p>
                    </div>
                  </div>
                  {showUsageAnalytics ? (
                    <FiChevronUp className="text-gray-600 text-xl" />
                  ) : (
                    <FiChevronDown className="text-gray-600 text-xl" />
                  )}
                </button>

                {showUsageAnalytics && (
                  <div className="px-6 pb-6 border-t pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <DashboardCard
                        title="Average Trip Duration"
                        value={avgTripDuration}
                        icon={FiClock}
                      />
                      <DashboardCard
                        title="Peak Usage Times"
                        value={peakUsageTime}
                        icon={FiCalendar}
                      />
                    </div>
                  </div>
                )}
              </div> */}

              {/* Department Usage Statistics - Collapsible */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                <div className="flex items-center gap-3">
                  <FiPieChart className="text-green-600 text-xl" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Department Usage Statistics
                    </h3>
                    <p className="text-sm text-gray-500">
                      View detailed breakdown by department
                    </p>
                  </div>
                </div>

                <DepartmentUsageChart />
              </div>

              {/* Fuel Consumption Report - Collapsible */}
              {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setShowFuelReport(!showFuelReport)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FiBarChart2 className="text-green-600 text-xl" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Fuel Consumption Report
                      </h3>
                      <p className="text-sm text-gray-500">
                        Analyze fuel usage across the fleet
                      </p>
                    </div>
                  </div>
                  {showFuelReport ? (
                    <FiChevronUp className="text-gray-600 text-xl" />
                  ) : (
                    <FiChevronDown className="text-gray-600 text-xl" />
                  )}
                </button>

                {showFuelReport && (
                  <div className="px-6 pb-6 border-t pt-6">
                    <FuelConsumptionReport />
                  </div>
                )}
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
