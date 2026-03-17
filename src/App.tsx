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
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approvals/hr"
          element={
            <ProtectedRoute>
              <HrApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approvals/manager"
          element={
            <ProtectedRoute>
              <ManagerApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security/check/:id"
          element={
            <ProtectedRoute>
              <VehicleCheckPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security/dashboard"
          element={
            <ProtectedRoute>
              <SecurityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
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
