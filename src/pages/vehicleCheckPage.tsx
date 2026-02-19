import React, { useState, useEffect } from "react";
import FloatingTextField from "../components/customInput";
import FuelSlider from "../components/FuelSlider";
import VehicleHistoryTable from "../components/securityTable";
import { useSecurityRequest } from "../context/securityRequestContext";
import { useSecurityCheck } from "../hooks/useSecurityCheck";
import { useSecurityReturnCheck } from "../hooks/useSecurityReturnCheck";
import { useAvailableVehicles } from "../hooks/useAvailableVehicles.hook";
import VehicleSelector from "../components/vehicleSelector";

const VehicleCheckPage = () => {
  const [activeTab, setActiveTab] = useState<"check-in" | "check-out">(
    "check-out",
  );
  const { vehicles, loading: vehiclesLoading } = useAvailableVehicles();
  const { selected } = useSecurityRequest();

  // Use the check-out hook (before trip)
  const {
    loading: checkOutLoading,
    request: checkOutRequest,
    error: checkOutError,
    submitBeforeTrip,
    refresh: refreshCheckOut,
  } = useSecurityCheck();

  // Use the check-in hook (after trip)
  const {
    loading: checkInLoading,
    request: checkInRequest,
    error: checkInError,
    submitAfterTrip,
    fetchRequest: fetchCheckInRequest,
  } = useSecurityReturnCheck();

  // Check-out state (before trip)
  const [checkOutData, setCheckOutData] = useState({
    vehicleNumber: "",
    currentMileage: "",
    fuelLevel: 0.5,
    vehicleCondition: "GOOD" as "GOOD" | "BAD",
    conditionNotes: "",
    driverAssigned: "",
  });

  // Check-in state (after trip)
  const [checkInData, setCheckInData] = useState({
    vehicleNumber: "",
    currentMileage: "",
    fuelLevel: 0.5,
    vehicleCondition: "GOOD" as "GOOD" | "BAD",
    conditionNotes: "",
  });

  // Fetch check-in request when tab changes to check-in
  useEffect(() => {
    if (activeTab === "check-in" && selected?.id) {
      fetchCheckInRequest(selected.id);
    }
  }, [activeTab, selected?.id, fetchCheckInRequest]);

  // Populate check-out form when request loads
  useEffect(() => {
    if (checkOutRequest?.security_check?.before) {
      const before = checkOutRequest.security_check.before;
      setCheckOutData({
        vehicleNumber: before.car_assigned || "",
        currentMileage: before.mileage_before?.toString() || "",
        fuelLevel: parseFloat(before.fuel_level_before) / 100 || 0.5,
        vehicleCondition: before.condition_before === "BAD" ? "BAD" : "GOOD",
        conditionNotes: before.condition_comment_before || "",
        driverAssigned: before.driver_assigned || "",
      });
    }
  }, [checkOutRequest]);

  // Populate check-in form when request loads
  useEffect(() => {
    if (checkInRequest?.security_check?.after) {
      const after = checkInRequest.security_check.after;
      setCheckInData({
        vehicleNumber: after.car_assigned || "",
        currentMileage: after.mileage_after?.toString() || "",
        fuelLevel: after.fuel_level_after
          ? parseFloat(after.fuel_level_after) / 100
          : 0.5,
        vehicleCondition: after.condition_after === "BAD" ? "BAD" : "GOOD",
        conditionNotes: after.condition_comment_after || "",
      });
    } else {
      // Reset form when switching to check-in tab if no data exists
      setCheckInData({
        vehicleNumber: "",
        currentMileage: "",
        fuelLevel: 0.5,
        vehicleCondition: "GOOD",
        conditionNotes: "",
      });
    }
  }, [checkInRequest]);

  const handleCheckOutSubmit = async () => {
    if (!selected?.id) {
      alert("No request selected");
      return;
    }

    if (!checkOutData.vehicleNumber.trim()) {
      alert("Please enter a vehicle number plate");
      return;
    }

    if (!checkOutData.currentMileage.trim()) {
      alert("Please enter the current mileage");
      return;
    }

    try {
      const payload = {
        mileage_before: parseInt(checkOutData.currentMileage),
        fuel_level_before: (checkOutData.fuelLevel * 100).toFixed(0),
        condition_before: checkOutData.vehicleCondition,
        condition_comment_before: checkOutData.conditionNotes || undefined,
        car_assigned: checkOutData.vehicleNumber,
        driver_assigned: checkOutData.driverAssigned.trim() || undefined,
      };

      await submitBeforeTrip(payload);
      alert("Check-out submitted successfully!");
      refreshCheckOut();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to submit check-out",
      );
    }
  };

  const handleCheckInSubmit = async () => {
    if (!selected?.id) {
      alert("No request selected");
      return;
    }

    // Add validation for vehicle number
    if (!checkInData.vehicleNumber.trim()) {
      alert("Please enter a vehicle number plate");
      return;
    }

    if (!checkInData.currentMileage.trim()) {
      alert("Please enter the current mileage");
      return;
    }

    try {
      const payload = {
        car_assigned: checkInData.vehicleNumber,
        mileage_after: parseInt(checkInData.currentMileage),
        fuel_level_after: Number((checkInData.fuelLevel * 100).toFixed(0)),
        condition_after: checkInData.vehicleCondition,
        condition_comment_after: checkInData.conditionNotes || undefined,
      };

      console.log("🚀 Check-in payload being sent:", payload); // ✅ Add this
      console.log("🚗 Vehicle number:", checkInData.vehicleNumber);

      await submitAfterTrip(selected.id, payload);
      alert("Check-in submitted successfully!");
      fetchCheckInRequest(selected.id);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to submit check-in",
      );
    }
  };

  const isCheckOut = activeTab === "check-out";
  const isLoading = isCheckOut ? checkOutLoading : checkInLoading;
  const currentError = isCheckOut ? checkOutError : checkInError;

  return (
    <div className="h-screen w-screen bg-slate-800 pt-5 px-8 overflow-auto">
      {selected ? (
        <>
          <h2 className="text-white font-semibold text-3xl mb-2">
            Running a check for: {selected?.employeeName || "N/A"}
          </h2>
          <p className="text-slate-400 mb-4">Request ID: {selected?.id}</p>
        </>
      ) : (
        <p className="text-yellow-400 mb-4">No request selected</p>
      )}

      {currentError && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          Error: {currentError}
        </div>
      )}

      {/* Centered container */}
      <div className="flex flex-row justify-center w-full gap-4 ">
        <div className="flex flex-col w-full bg-slate-900 rounded-lg max-w-4xl">
          {/* Tab Toggle */}
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab("check-out")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "check-out"
                  ? "bg-slate-700 text-white"
                  : "bg-transparent text-slate-400 hover:text-white"
              }`}
            >
              Check-out (Before Trip)
            </button>
            <button
              onClick={() => setActiveTab("check-in")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "check-in"
                  ? "bg-slate-700 text-white"
                  : "bg-transparent text-slate-400 hover:text-white"
              }`}
            >
              Check-in (After Trip)
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Check-out Form */}
            {isCheckOut ? (
              <>
                <div className="gap-x-8 flex flex-row">
                  <div className="flex-1">
                    <VehicleSelector
                      label="Vehicle Number Plate"
                      value={checkOutData.vehicleNumber}
                      onChange={(value) =>
                        setCheckOutData({
                          ...checkOutData,
                          vehicleNumber: value,
                        })
                      }
                      vehicles={vehicles}
                      loading={vehiclesLoading}
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <p className="block text-white text-sm font-medium">
                      Vehicle Mileage
                    </p>
                    <FloatingTextField
                      label={"Current Mileage (km)"}
                      value={checkOutData.currentMileage}
                      textColor="text-gray-300"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCheckOutData({
                          ...checkOutData,
                          currentMileage: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="gap-x-8 flex flex-row">
                  <div className="flex-1">
                    <FuelSlider
                      value={checkOutData.fuelLevel}
                      onChange={(value) =>
                        setCheckOutData({ ...checkOutData, fuelLevel: value })
                      }
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-white text-sm font-medium mb-3">
                      Vehicle Condition
                    </label>
                    <div className="flex gap-6 items-center h-full pt-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="vehicle-condition-checkout"
                          value="GOOD"
                          checked={checkOutData.vehicleCondition === "GOOD"}
                          onChange={(e) =>
                            setCheckOutData({
                              ...checkOutData,
                              vehicleCondition: e.target.value as
                                | "GOOD"
                                | "BAD",
                            })
                          }
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-white">Good</span>
                      </label>

                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="vehicle-condition-checkout"
                          value="BAD"
                          checked={checkOutData.vehicleCondition === "BAD"}
                          onChange={(e) =>
                            setCheckOutData({
                              ...checkOutData,
                              vehicleCondition: e.target.value as
                                | "GOOD"
                                | "BAD",
                            })
                          }
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-white">Bad</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Vehicle Condition Notes
                  </label>
                  <textarea
                    id="condition-notes-checkout"
                    value={checkOutData.conditionNotes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCheckOutData({
                        ...checkOutData,
                        conditionNotes: e.target.value,
                      })
                    }
                    placeholder="e.g., Minor scratch on rear bumper..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <p className="block text-white text-sm font-medium mb-2">
                    Driver Assigned (Optional)
                  </p>
                  <FloatingTextField
                    label={"Enter driver name or leave empty for self-drive"}
                    value={checkOutData.driverAssigned}
                    textColor="text-gray-300"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCheckOutData({
                        ...checkOutData,
                        driverAssigned: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            ) : (
              /* Check-in Form */
              <>
                <div className="gap-x-8 flex flex-row">
                  <div className="flex-1">
                    <VehicleSelector
                      label="Vehicle Number Plate"
                      value={checkInData.vehicleNumber}
                      onChange={(value) =>
                        setCheckInData({
                          ...checkInData,
                          vehicleNumber: value,
                        })
                      }
                      vehicles={vehicles}
                      loading={vehiclesLoading}
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <p className="block text-white text-sm font-medium">
                      Vehicle Mileage
                    </p>
                    <FloatingTextField
                      label={"Current Mileage (km)"}
                      value={checkInData.currentMileage}
                      textColor="text-gray-200"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCheckInData({
                          ...checkInData,
                          currentMileage: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="gap-x-8 flex flex-row">
                  <div className="flex-1">
                    <FuelSlider
                      value={checkInData.fuelLevel}
                      onChange={(value) =>
                        setCheckInData({ ...checkInData, fuelLevel: value })
                      }
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-white text-sm font-medium mb-3">
                      Vehicle Condition
                    </label>
                    <div className="flex gap-6 items-center h-full pt-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="vehicle-condition-checkin"
                          value="GOOD"
                          checked={checkInData.vehicleCondition === "GOOD"}
                          onChange={(e) =>
                            setCheckInData({
                              ...checkInData,
                              vehicleCondition: e.target.value as
                                | "GOOD"
                                | "BAD",
                            })
                          }
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-white">Good</span>
                      </label>

                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="vehicle-condition-checkin"
                          value="BAD"
                          checked={checkInData.vehicleCondition === "BAD"}
                          onChange={(e) =>
                            setCheckInData({
                              ...checkInData,
                              vehicleCondition: e.target.value as
                                | "GOOD"
                                | "BAD",
                            })
                          }
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-white">Bad</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Vehicle Condition Notes
                  </label>
                  <textarea
                    id="condition-notes-checkin"
                    value={checkInData.conditionNotes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCheckInData({
                        ...checkInData,
                        conditionNotes: e.target.value,
                      })
                    }
                    placeholder="e.g., Minor scratch on rear bumper..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={
                  isCheckOut ? handleCheckOutSubmit : handleCheckInSubmit
                }
                disabled={isLoading || !selected?.id}
                className={`px-6 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCheckOut
                    ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                    : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                }`}
              >
                {isLoading
                  ? "Submitting..."
                  : `Submit ${isCheckOut ? "Check-out" : "Check-in"}`}
              </button>
            </div>
          </div>
        </div>
        <div>
          <VehicleHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default VehicleCheckPage;
