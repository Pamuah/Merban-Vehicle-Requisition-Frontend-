import { useState, useEffect } from "react";
import { FiSettings, FiLogOut, FiHome, FiClock, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NavButton from "./navButton";

export default function SidebarNavigation() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userName, setUserName] = useState<string>("Loading...");
  const [userEmail, setUserEmail] = useState<string>("");

  // Load user data and profile image on mount
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || "N/A");
        setUserEmail(user.email || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Get saved profile image from localStorage
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        // Save to localStorage to persist across sessions
        localStorage.setItem("profileImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    // Clear user data but keep profile image
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Note: We're NOT removing "profileImage" so it persists

    navigate("/login");
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);

    // Handle navigation based on tab
    switch (tab) {
      case "Dashboard":
        navigate("/home");
        break;
      case "History":
        navigate("/history");
        break;
      case "Settings":
        navigate("/settings");
        break;
      case "Log Out":
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-3 bg-[#D7F97C] text-[#0D2A29] fixed top-4 left-4 rounded-xl z-50 font-semibold"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-90 bg-[#0D2A29] shadow-xl p-6 flex flex-col justify-between transform transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Top Section */}
        <div>
          {/* Logo */}
          <h1 className="text-3xl font-bold text-[#D7F97C] text-center mb-6">
            Merban Capital
          </h1>

          {/* Profile Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#2A4A49] overflow-hidden flex items-center justify-center mb-2 border-4 border-white/5">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-[#B6C8C7] h-12 w-12 text-3xl" />
              )}
            </div>
            <label className="cursor-pointer text-sm text-[#D7F97C] font-medium hover:text-[#B6C8C7] transition-colors">
              {profileImage ? "Change Photo" : "Upload Photo"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* User Details */}
          <div className="gap-y-2 text-center mb-6">
            <p className="text-[#B6C8C7] font-medium">{userName}</p>
            <p className="text-[#7C8D8C] text-sm">{userEmail}</p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2 mt-10">
            <NavButton
              label="Dashboard"
              icon={FiHome}
              active={activeTab === "Dashboard"}
              onClick={() => handleNavigation("Dashboard")}
            />
            <NavButton
              label="History"
              icon={FiClock}
              active={activeTab === "History"}
              onClick={() => handleNavigation("History")}
            />

            <div className="flex flex-col gap-2 mt-4">
              <NavButton
                label="Settings"
                icon={FiSettings}
                active={activeTab === "Settings"}
                onClick={() => handleNavigation("Settings")}
              />
              <NavButton
                label="Log Out"
                icon={FiLogOut}
                active={activeTab === "Log Out"}
                onClick={() => handleNavigation("Log Out")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
