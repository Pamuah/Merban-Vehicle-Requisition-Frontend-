import { type ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-gray-50 w-[90%] max-w-3xl p-6 rounded-2xl shadow-lg text-white animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600">
            {title || "New Request"}
          </h2>

          <button onClick={onClose}>
            <FiX className="text-gray-500 text-2xl hover:text-black" />
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
}
