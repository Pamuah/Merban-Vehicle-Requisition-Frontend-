import React, { useState } from "react";

interface FuelSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const FuelSlider: React.FC<FuelSliderProps> = ({
  value = 0.5,
  onChange,
  className = "",
}) => {
  const [sliderValue, setSliderValue] = useState<number>(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setSliderValue(newValue);
    onChange?.(newValue);
  };

  // const getFuelLabel = (val: number): string => {
  //   if (val === 0) return "E";
  //   if (val === 0.25) return "1/4";
  //   if (val === 0.5) return "1/2";
  //   if (val === 0.75) return "3/4";
  //   if (val === 1) return "F";
  //   return `${Math.round(val * 100)}%`;
  // };

  return (
    <div className={className}>
      <label className="block text-white text-lg font-medium mb-3">
        Fuel Level
      </label>

      <div className="relative">
        {/* Slider container */}
        <div className="relative h-2 bg-slate-700 rounded-full">
          {/* Progress bar */}
          <div
            className="absolute h-full bg-green-700 rounded-full transition-all duration-150"
            style={{ width: `${sliderValue * 100}%` }}
          />

          {/* Tick marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((mark) => (
            <div
              key={mark}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-gray-300"
              style={{ left: `${mark * 100}%` }}
            />
          ))}

          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sliderValue}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-green-700 rounded-full border-3 border-slate-800 shadow-lg pointer-events-none transition-all duration-150"
            style={{ left: `${sliderValue * 100}%` }}
          >
            <div className="absolute inset-0 rounded-full ring-2 ring-green-800" />
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-sm text-gray-300">
          <span>E</span>
          <span>1/4</span>
          <span>1/2</span>
          <span>3/4</span>
          <span>F</span>
        </div>
      </div>
    </div>
  );
};

export default FuelSlider;
