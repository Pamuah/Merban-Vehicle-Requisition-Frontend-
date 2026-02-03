import { useState } from "react";
import FloatingTextField from "../components/customInput";
import CustomButton from "../components/customButton";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../hooks/auth.hooks";
import type { RegisterData, RegisterForm } from "../types/auth.types";
import boardroom from "../assets/boardroom.jpg";
import Dropdown from "../components/dropDown";
import { departmentOptions } from "../data/departmentData";
import { roleOptions } from "../data/roleData";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { register, loading, error } = useAuth(); // ✅ Correct
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "",
  });

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword, department, role } = form;

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    const payload: RegisterData = {
      name,
      email,
      password,
      department,
      role,
    };

    try {
      const user = await register(payload); // ✅ Correct function name
      console.log("Registration success:", user);

      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 p-8">
      {/* Left side image */}
      <div className="w-1/2 h-full relative">
        <img
          src={boardroom}
          alt="Office"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="absolute top-8 left-8 z-10 text-green-600 text-4xl font-bold">
          Merban Capital
        </div>
        <div className="absolute bottom-8 left-8 z-10 text-green-600 text-xl">
          Welcome to Vehicle Registry © 2026 Merban Capital
        </div>
      </div>

      {/* Right side form */}
      <div className="w-1/2 h-full flex flex-col justify-center items-center px-16">
        <div className="w-full max-w-md">
          <p className="text-4xl font-serif text-gray-800 mb-2">
            Create your Account
          </p>

          <p className="text-gray-500 mb-8">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-500 cursor-pointer underline"
            >
              Login
            </span>
          </p>

          <div className="mb-4 flex flex-col gap-3">
            <FloatingTextField
              label="Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              type="text"
            />

            <FloatingTextField
              label="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              type="email"
            />

            <div className="flex flex-row gap-x-4">
              <Dropdown
                options={departmentOptions}
                selected={form.department}
                onChange={(value) => handleChange("department", value)}
                placeholder="Select Department"
              />

              <Dropdown
                options={roleOptions}
                selected={form.role}
                onChange={(value) => handleChange("role", value)}
                placeholder="Select Role"
              />
            </div>

            <FloatingTextField
              label="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              type="password"
            />

            <FloatingTextField
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              type="password"
            />
          </div>

          <CustomButton
            label={loading ? "Registering..." : "Register"}
            icon={<FiLogIn />}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
