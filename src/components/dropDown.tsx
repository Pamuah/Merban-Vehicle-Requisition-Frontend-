import React, { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  selected?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-64 ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 
                   bg-gray-100 border border-green-600 rounded-lg shadow-sm 
                   text-gray-800 hover:bg-green-50 focus:outline-none 
                   focus:ring-2 focus:ring-green-600"
      >
        <span className="text-gray-800">
          {selected
            ? options.find((o) => o.value === selected)?.label
            : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-green-600 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="absolute mt-2 w-full bg-white border border-green-600 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2 cursor-pointer text-gray-800 
                          hover:bg-green-100 ${
                            selected === option.value
                              ? "bg-green-50 font-semibold text-green-600"
                              : ""
                          }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
