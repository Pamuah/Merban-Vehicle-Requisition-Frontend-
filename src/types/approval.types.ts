export interface ApprovalUser {
  _id: string;
  fullName?: string;
  email?: string;
  department?: string;
}

export interface ApprovalRequest {
  _id: string;
  requestor?: string | ApprovalUser;
  date: string;
  departure_time: string;
  estimated_arrival_time: string;
  destination: string;
  purpose: string;
  requestor_department?: string;
  manager_approval?: string;
  hr_approval?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Request {
  _id: string;
  requestor?: {
    name: string;
  };
  date: string;
  departure_time: string;
  estimated_arrival_time: string;
  destination: string;
  purpose: string;
  status: string;
  createdAt: string;
}

export interface ApprovalTableProps {
  items: Request[];
  onApprove?: (id: string) => void | Promise<void>;
  onReject?: (id: string) => void | Promise<void>;
  showActions?: boolean;
  onRowClick?: (req: Request) => void;
}
