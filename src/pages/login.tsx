import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingTextField from "../components/customInput";
import CustomButton from "../components/customButton";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../hooks/auth.hooks";
import { useAdminAuth } from "../hooks/auth.Admin.hook.ts";
import type { LoginData } from "../types/auth.types";
import office from "../assets/office.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { login } = useAuth();
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Check if this is an admin login attempt (username is "admin")
      if (email.toLowerCase() === "admin") {
        await adminLogin(email, password);
        navigate("/admin/dashboard");
      } else {
        const credentials: LoginData = { email, password };
        const user = await login(credentials);
        console.log("✅ User login success:", user);

        const role =
          user?.role?.toLowerCase() ||
          localStorage.getItem("role")?.toLowerCase() ||
          "";

        if (role === "security") {
          navigate("/security/dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 p-8">
      {/* Left side - Image with overlay */}
      <div className="w-1/2 h-full relative">
        {/* Background image */}
        <img src={office} alt="Office" className="w-full h-full object-cover" />

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        {/* Text content above overlay */}
        <div className="absolute top-8 left-8 z-10 text-green-600 text-3xl font-bold">
          Merban Capital
        </div>
        <div className="absolute bottom-8 left-8 z-10 text-green-600 text-xl">
          Welcome to Vehicle Registry © 2026 Merban Capital
        </div>
      </div>

      {/* Right side - Sign-in form */}
      <div className="w-1/2 h-full flex flex-col justify-center items-center px-16">
        <div className="w-full max-w-md">
          <p className="text-4xl font-serif text-gray-800 mb-2">
            Welcome, Sign-In to your Account
          </p>
          <p className="text-gray-500 mb-8">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 cursor-pointer underline"
            >
              Register
            </span>
          </p>
          <div className="mb-4 flex flex-col gap-4">
            <FloatingTextField
              label="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
            <FloatingTextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          {/* Error message */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {loginError}
            </div>
          )}

          <CustomButton
            label={isLoading ? "Logging in..." : "Sign In"}
            variant="outline"
            icon={<FiLogIn />}
            onClick={handleSubmit}
            disabled={isLoading}
          />

          {/* Subtle hint for admin login */}
          <p className="text-gray-400 text-xs mt-4 text-center">
            Admin users: Use your admin username to login
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
