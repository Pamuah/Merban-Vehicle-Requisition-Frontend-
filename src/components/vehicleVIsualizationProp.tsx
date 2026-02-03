import React, { useState } from "react";

interface Vehicle {
  plate_number: string;
  color?: string;
  make?: string;
  model?: string;
  status?: string;
}

interface VehicleVisualizationProps {
  vehicles: Vehicle[];
  title?: string;
  size?: "sm" | "md" | "lg";
}

const VehicleVisualization: React.FC<VehicleVisualizationProps> = ({
  vehicles,
  title,
  size = "md",
}) => {
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

  // Size configurations
  const sizeConfig = {
    sm: { container: "w-24 h-24", inner: "w-12 h-12", text: "text-xs" },
    md: { container: "w-32 h-32", inner: "w-16 h-16", text: "text-sm" },
    lg: { container: "w-40 h-40", inner: "w-20 h-20", text: "text-base" },
  };

  const config = sizeConfig[size];

  // Generate color if not provided
  const getVehicleColor = (vehicle: Vehicle, index: number): string => {
    if (vehicle.color) return vehicle.color;

    const colors = [
      "#3B82F6", // blue
      "#10B981", // green
      "#F59E0B", // amber
      "#EF4444", // red
      "#8B5CF6", // purple
      "#EC4899", // pink
      "#14B8A6", // teal
      "#F97316", // orange
    ];
    return colors[index % colors.length];
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3">
        {title && <h3 className="font-semibold text-gray-700">{title}</h3>}
        <div
          className={`${config.container} rounded-full border-4 border-gray-200 flex items-center justify-center`}
        >
          <span className="text-gray-400 text-sm">No vehicles</span>
        </div>
      </div>
    );
  }

  const segmentAngle = 360 / vehicles.length;
  const gapAngle = Math.min(4, segmentAngle * 0.1);

  return (
    <div className="flex flex-col gap-4">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">{title}</h3>
          <span className="text-sm text-gray-500">
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* Circular visualization */}
        <div className={`relative ${config.container} flex-shrink-0`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {vehicles.map((vehicle, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = startAngle + segmentAngle - gapAngle;

              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const radius = 40;
              const centerX = 50;
              const centerY = 50;

              const startX = centerX + radius * Math.cos(startRad);
              const startY = centerY + radius * Math.sin(startRad);
              const endX = centerX + radius * Math.cos(endRad);
              const endY = centerY + radius * Math.sin(endRad);

              const largeArcFlag = segmentAngle - gapAngle > 180 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                "Z",
              ].join(" ");

              const isHovered = hoveredVehicle === vehicle.plate_number;
              const vehicleColor = getVehicleColor(vehicle, index);

              return (
                <g key={vehicle.plate_number}>
                  <path
                    d={pathData}
                    fill={vehicleColor}
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      opacity: hoveredVehicle && !isHovered ? 0.3 : 1,
                      filter: isHovered ? "brightness(1.1)" : "none",
                    }}
                    onMouseEnter={() => setHoveredVehicle(vehicle.plate_number)}
                    onMouseLeave={() => setHoveredVehicle(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`${config.inner} bg-white rounded-full shadow-inner flex items-center justify-center`}
            >
              <span className="text-xl font-bold text-gray-700">
                {vehicles.length}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {vehicles.map((vehicle, index) => {
            const isHovered = hoveredVehicle === vehicle.plate_number;
            const vehicleColor = getVehicleColor(vehicle, index);

            return (
              <div
                key={vehicle.plate_number}
                className={`flex items-center gap-2 px-2 py-1 rounded transition-all duration-200 cursor-pointer ${
                  isHovered ? "bg-gray-100 scale-105" : ""
                }`}
                onMouseEnter={() => setHoveredVehicle(vehicle.plate_number)}
                onMouseLeave={() => setHoveredVehicle(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: vehicleColor }}
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className={`${config.text} font-medium text-gray-700 truncate`}
                  >
                    {vehicle.plate_number}
                  </span>
                  {(vehicle.make || vehicle.model) && (
                    <span className="text-xs text-gray-500 truncate">
                      {vehicle.make} {vehicle.model}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VehicleVisualization;
