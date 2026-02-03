export interface CommentData {
  name: string;
  email: string;
  department: string;
  employeeId: string;
  comment: string;
}

export interface CommentFilters {
  status?: string;
  limit?: number;
  page?: number;
}

export interface ApiError {
  message: string;
}
