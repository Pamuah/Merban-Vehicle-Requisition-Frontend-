import SidebarNavigation from "../components/sideNav";
import CustomButton from "../components/customButton";
import {
  FiAlertTriangle,
  FiCheck,
  FiClock,
  FiPlus,
  FiSlash,
} from "react-icons/fi";
import DashboardCard from "../components/dashboardCard";
import { useEffect, useState } from "react";
import Modal from "../components/modal";
import NewRequestForm from "./newRequest";
import RequestHistoryTable from "../components/historyTable";
import { useRequestStats } from "../hooks/vehicleStats.hooks";
import { useNavigate } from "react-router-dom";
import UserComment from "../components/UserComment";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dentModalOpen, setDentModalOpen] = useState(false);
  const { fetchStats, data } = useRequestStats();
  const navigate = useNavigate();
  const role = localStorage.getItem("role")?.toLowerCase();

  useEffect(() => {
    fetchStats();
  }, []);
  return (
    <div className="h-screen w-screen flex bg-gray-50">
      {/* Sidebar fixed on the left */}
      <SidebarNavigation />

      {/* Main Content Area */}
      <div className="flex-1 ml-90">
        {/* Top Navbar */}
        <div className="bg-white shadow-md h-16 w-full flex items-center px-6">
          <p className="text-green-600 font-semibold text-2xl">Dashboard</p>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-6">
            <DashboardCard
              title="Completed"
              value={data?.completed ?? 0}
              icon={FiCheck}
            />

            <DashboardCard
              title="Rejected"
              value={data?.rejected ?? 0}
              icon={FiSlash}
            />

            <DashboardCard
              title="Pending"
              value={data?.pending ?? 0}
              icon={FiClock}
            />

            {(role === "manager" || role === "hr") && (
              <DashboardCard
                title="View Staff Requests"
                value={data?.pendingApprovals ?? 0}
                icon={FiClock}
                onClick={() => {
                  if (role === "manager") {
                    navigate("/approvals/manager");
                  } else if (role === "hr") {
                    navigate("/approvals/hr");
                  }
                }}
              />
            )}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            {/* Existing New Request Button */}
            <CustomButton
              className="border-2 border-green-500 hover:bg-gray-200"
              label="New Request"
              variant="outline"
              size="lg"
              icon={<FiPlus className="h-8 w-8" />}
              onClick={() => setModalOpen(true)}
            />

            {/* New Report Dent Button */}
            <CustomButton
              className="border-2 border-red-500 hover:bg-red-50"
              label="Report Dent"
              variant="outline"
              size="lg"
              icon={<FiAlertTriangle className="h-8 w-8" />}
              onClick={() => setDentModalOpen(true)}
            />
          </div>

          {/* Existing Modal */}
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Create Request"
          >
            <NewRequestForm onClose={() => setModalOpen(false)} />
          </Modal>

          {/* New Dent Report Modal */}
          <Modal
            open={dentModalOpen}
            onClose={() => setDentModalOpen(false)}
            title="Report Vehicle Dent"
          >
            <UserComment onClose={() => setDentModalOpen(false)} />
          </Modal>
          <p className="my-4 text-lg font-semibold ">Request History</p>
          <RequestHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
