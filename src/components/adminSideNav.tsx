import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiShoppingCart,
  FiBarChart2,
  FiUsers,
  FiGitBranch,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import type { IconType } from "react-icons";

interface MenuItem {
  id: string;
  label: string;
  icon?: IconType;
  path?: string; // Add path for routing
  isHeader?: boolean;
}

interface SideNavProps {
  open?: boolean;
  onLogout?: () => void; // Optional logout handler
}

const AdminSideNav: React.FC<SideNavProps> = ({ open = true, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { id: "Section", label: "Section", isHeader: true },
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: FiShoppingCart,
      path: "/admin/dashboard",
    },
    {
      id: "Operational Metrics",
      label: "Operational Metrics",
      icon: FiBarChart2,
      path: "/admin/operational-metrics",
    },
    { id: "Fuel", label: "Fuel", icon: FiUsers, path: "/admin/fuel" },
    {
      id: "History",
      label: "History",
      icon: FiGitBranch,
      path: "/admin/history",
    },
    {
      id: "Reports",
      label: "Reports",
      icon: FiGitBranch,
      path: "/admin/comments",
    },
  ];

  // Check if current path matches the menu item path
  const isActive = (path?: string) => {
    if (!path) return false;
    // Exact match for dashboard, starts with for others
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      navigate("/");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 z-40 ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">MC</span>
        </div>
        <span className="font-semibold text-gray-800 text-lg">
          Merban Capital
        </span>
      </div>

      {/* Navigation Items - Scrollable */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.isHeader) {
            return (
              <div key={item.id} className="px-3 py-2 mt-4 mb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            );
          }

          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                active
                  ? "bg-blue-50 text-green-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {Icon && <Icon size={18} />}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-400 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">NA</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-800">
              Nana Ama D. P. Ayiku
            </div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/settings")}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FiSettings size={16} />
            <span>Setting</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSideNav;
