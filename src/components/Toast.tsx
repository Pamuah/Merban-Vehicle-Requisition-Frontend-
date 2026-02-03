import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast: React.FC = () => <ToastContainer />;

export const ShowToast = (type: "success" | "error", message: string) => {
  if (type === "success") {
    toast.success(message, { position: "top-center", autoClose: 3000 });
  } else if (type === "error") {
    toast.error(message, { position: "top-center", autoClose: 3000 });
  }
};

export default Toast;
