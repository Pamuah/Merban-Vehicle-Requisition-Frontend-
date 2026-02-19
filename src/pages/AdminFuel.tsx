// import { useNavigate } from "react-router-dom";
// import { useAdminAuth } from "../hooks/auth.Admin.hook";
import FuelConsumptionReport from "../components/FuelReport";
import AdminSideNav from "../components/adminSideNav";

const AdminFuel = () => {
  // const navigate = useNavigate();
  // const { adminLogout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSideNav />

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Navbar */}
        <div className="fixed top-0 right-0 left-64 bg-white shadow-md h-16 flex items-center px-6 z-30">
          <p className="text-green-500 font-semibold text-2xl">
            Fuel Consumption
          </p>
        </div>

        {/* Page Content */}
        <div className="pt-16 px-8 pb-8">
          <div className="px-6 pt-6">
            <FuelConsumptionReport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFuel;
