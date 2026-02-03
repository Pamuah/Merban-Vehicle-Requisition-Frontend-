import React from "react";
import type { VehicleSelectorProps } from "../types/vehicle.types";

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  label,
  value,
  onChange,
  vehicles,
  loading = false,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {loading ? (
        <div className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-400">
          Loading vehicles...
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.5em 1.5em",
            appearance: "none",
            paddingRight: "2.5rem",
          }}
        >
          <option value="" disabled>
            -- Select a vehicle --
          </option>
          {vehicles.map((vehicle) => (
            <option key={vehicle._id} value={vehicle.plate_number}>
              {vehicle.plate_number} - {vehicle.make} {vehicle.model}
            </option>
          ))}
        </select>
      )}

      {vehicles.length === 0 && !loading && (
        <p className="text-sm text-red-400 mt-1">No available vehicles</p>
      )}
    </div>
  );
};

export default VehicleSelector;
