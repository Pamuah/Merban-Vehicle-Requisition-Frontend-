import FloatingTextField from "../components/customInput";
import Stepper from "../components/stepper";
import { useState } from "react";
import type { NewRequestData } from "../types/vehicleRequest.types.ts";
import { useVehicleRequest } from "../hooks/vehicleRequest.hooks.ts";
import { ShowToast } from "../components/Toast";

interface FormData {
  date: string;
  departureTime: string;
  arrivalTime: string;
  destination: string;
  purpose: string;
}

interface NewRequestFormProps {
  onClose: () => void;
}

export default function NewRequestForm({ onClose }: NewRequestFormProps) {
  const [step, setStep] = useState(1);
  const { createRequest, } = useVehicleRequest();

  // unified form state
  const [formData, setFormData] = useState<FormData>({
    date: "",
    departureTime: "",
    arrivalTime: "",
    destination: "",
    purpose: "",
  });

  const steps = [
    { step: 1, title: "Schedule" },
    { step: 2, title: "Destination and Purpose" },
  ];

  // generic handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const data: NewRequestData = {
      date: formData.date,
      departure_time: formData.departureTime,
      estimated_arrival_time: formData.arrivalTime,
      destination: formData.destination,
      purpose: formData.purpose,
    };

    try {
      console.log("Submitting payload:", data);

      const result = await createRequest(data);

      console.log("✅ Vehicle request submitted:", result);

      ShowToast("success", "Request submitted successfully!");
      onClose();
    } catch (err) {
      console.error("❌ Vehicle request failed:", err);

      ShowToast("error", "Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex gap-8 items-start">
        {/* Stepper column - fixed width */}
        <div className="w-48 shrink-0">
          <Stepper currentStep={step} steps={steps} />
        </div>

        {/* Form column - flexible width */}
        <div className="flex-1 min-w-0 pl-8 border-l border-gray-200">
          {step === 1 && (
            <div>
              <h2 className="text-base font-semibold mb-6">Schedule</h2>
              <div className="space-y-5">
                {/* Normal inputs */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="rounded-lg px-4 py-2.5 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    className="border border-gray-300 text-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Est. Arrival Time
                  </label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    className="border border-gray-300 text-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-base font-semibold mb-6">
                Destination and Purpose
              </h2>
              <div className="space-y-5">
                <FloatingTextField
                  label="Destination"
                  type="text"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                />
                <FloatingTextField
                  label="Official Purpose"
                  type="text"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Navigation buttons - now inside form column */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            {step < steps.length && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            )}
            {step === steps.length && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
