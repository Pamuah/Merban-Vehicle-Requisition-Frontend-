import React, { useState, type FocusEvent } from "react";

interface FloatingTextFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textColor?: string;
}

const FloatingTextField: React.FC<FloatingTextFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  textColor = "text-gray-800",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) setIsFocused(false);
  };

  return (
    <div className="relative w-full my-4">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`peer w-full  border-2 rounded-lg px-3 pt-5 pb-2 ${textColor} bg-placeholder-transparent focus:outline-none transition-colors ${
          isFocused ? "border-green-400" : "border-gray-300"
        }`}
        placeholder={label}
      />
      <label
        className={`absolute left-3 text-gray-50 transition-all rounded-sm bg-gray-500 px-1 ${
          isFocused || value
            ? "text-xs -top-2 text-blue-500"
            : "text-base top-3"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingTextField;
