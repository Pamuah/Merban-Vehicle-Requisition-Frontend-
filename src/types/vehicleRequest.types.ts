export interface NewRequestData {
  date: string;
  departure_time: string;
  estimated_arrival_time: string;
  destination: string;
  purpose: string;
}

export interface NewRequestResponse {
  _id: string;
  user: string;
  department: string;
  status: string;
  date: string;
  createdAt: string;
}

export interface RequestHistoryResponse {
  _id: string;
  requestor: string;
  date: string;
  departure_time: string;
  estimated_arrival_time: string;
  destination: string;
  purpose: string;
  requestor_department: string;
  manager_approval: string;
  hr_approval: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VehicleRequestStats {
  completed: number;
  pending: number;
  rejected: number;
  total: number; // optional and not added yet to frontend
  pendingApprovals?: number; // only for managers and HR
  systemStats?: {
    // ✅ Optional - only for CEO
    total: number;
    completed: number;
    pending: number;
    rejected: number;
  };
}
