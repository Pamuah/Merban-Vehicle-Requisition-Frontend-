export interface SecurityCheckForm {
  vehiclePlate: string;
  mileage: number;
  fuelLevel: number;
  conditionNotes: string;
}

export interface VehicleHistoryItem {
  _id: string;
  date: string;
  plate: string;
  action: "Check-in" | "Check-out";
  mileage: number;
  fuel: string;
  notes: string;
}
interface Vehicle {
  _id: string;
  plate_number: string;
  make: string;
  model: string;
  year?: number;
  status: string;
  Tank_Capacity?: number;
}
export interface VehicleSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  vehicles: Vehicle[];
  loading?: boolean;
  required?: boolean;
}
