import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/sign_up";
import Dashboard from "./pages/dashboard";
import ManagerApprovals from "./pages/managerPage";
import HrApprovals from "./pages/hrApprovalPage";
import VehicleCheckPage from "./pages/vehicleCheckPage";
import SecurityPage from "./pages/securityPage";
import AdminPage from "./pages/admin_Page";
import AdminOperationMetrics from "./pages/AdminOperationMetrics";
import AdminFuel from "./pages/AdminFuel";
import AdminHistory from "./pages/AdminHistory";
import AdminComments from "./pages/AdminComments";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/approvals/hr" element={<HrApprovals />} />
        <Route path="/approvals/manager" element={<ManagerApprovals />} />
        <Route path="/security/check/:id" element={<VehicleCheckPage />} />
        <Route path="/security/dashboard" element={<SecurityPage />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route
          path="/admin/operational-metrics"
          element={<AdminOperationMetrics />}
        />
        <Route path="/admin/fuel" element={<AdminFuel />} />
        <Route path="/admin/history" element={<AdminHistory />} />
        <Route path="/admin/comments" element={<AdminComments />} />
      </Routes>
    </Router>
  );
}

export default App;
