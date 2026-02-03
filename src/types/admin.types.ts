export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    username: string;
    role: string;
    isAdmin: boolean;
  };
}

export interface DashboardStats {
  totalUsers: number;
  ongoingTrips: number;
  todaysCheckouts: number;
  todaysCheckins: number;
  pendingApprovals: number;
  totalRejections: number;
  completedTrips: number;
}

export interface ApprovalRates {
  totalRequests: number;
  completedRequests: number;
  rejectedRequests: number;
  approvalRate: number;
  rejectionRate: number;
}

export interface Vehicle {
  _id: string;
  plateNumber: string;
  model: string;
  make?: string;
  year?: number;
  color?: string;
  status: string;
}

export interface VehicleInUse {
  _id: string;
  car_assigned: {
    plateNumber: string;
    model: string;
  };
  requestor: {
    name: string;
    email: string;
    department: string;
  };
  status: string;
  date: string;
  destination: string;
}

export interface TripStats {
  vehicleId: string;
  plateNumber: string;
  model: string;
  tripCount: number;
  totalMileage: number;
}

export interface FuelStats {
  vehicleId: string;
  plateNumber: string;
  model: string;
  totalFuelConsumed: number;
  averageFuelConsumption: number;
  tripCount: number;
  make: string;
  tankCapacity: number;
}

export interface MostRequestedVehicle {
  vehicleId: string;
  plateNumber: string;
  model: string;
  requestCount: number;
}

export interface TripDuration {
  averageDurationMs: number;
  averageDurationHours: number;
  minDurationHours: number;
  maxDurationHours: number;
  totalTrips: number;
}

export interface DepartmentStats {
  department: string;
  totalRequests: number;
  completedTrips: number;
  rejectedRequests: number;
  pendingRequests: number;
  completionRate: number;
}

export interface PeakUsageTime {
  hour: string;
  dayOfWeek: string;
  requestCount: number;
}
