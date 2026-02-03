import React from "react";
import AdminSideNav from "../components/adminSideNav";
import AdminStaffComments from "../components/AdminStaffComments";

const AdminComments = () => {
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
          <div>
            <AdminStaffComments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComments;
