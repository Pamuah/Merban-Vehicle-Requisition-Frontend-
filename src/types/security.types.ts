export interface BeforeTripCheckPayload {
  mileage_before: number;
  condition_before: "GOOD" | "BAD";
  condition_comment_before?: string;
  fuel_level_before: string;
  car_assigned: string;
}

export interface AfterTripCheckPayload {
  car_assigned: string;
  mileage_after: number;
  condition_after: "GOOD" | "BAD";
  condition_comment_after?: string;
  fuel_level_after: number;
}

export interface VehicleRequest {
  _id: string;
  requestor: string;
  date: string;
  destination: string;
  purpose: string;
  manager_approval: string;
  hr_approval: string;
  security_check: {
    before: {
      mileage_before: number;
      condition_before: string;
      condition_comment_before?: string;
      fuel_level_before: string;
      car_assigned: string | null;
      driver_assigned?: string;
    };
    after: {
      car_assigned: string;
      mileage_after: number;
      condition_after: string;
      condition_comment_after?: string;
      fuel_level_after: string;
    };
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityHistoryItem {
  _id: string;
  requestor: {
    name: string;
    email: string;
  };
  date: string;
  departure_time: string;
  car_assigned: {
    plateNumber: string;
    model: string;
  } | null;
  security_check?: {
    before?: {
      mileage_before: number;
      fuel_level_before: string;
      condition_before: string;
      condition_comment_before?: string;
      car_assigned?: string;
    };
    after?: {
      car_assigned?: string;
      mileage_after: number;
      fuel_level_after: string;
      condition_after: string;
      condition_comment_after?: string;
    };
  };
  updatedAt: string;
  status: string;
}
