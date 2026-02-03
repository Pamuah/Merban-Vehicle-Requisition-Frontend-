export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  department: string;
  _id: string;
  name: string;
  email: string;
  token: string;
  role: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
}

// frontend-only form model
export type RegisterForm = RegisterData & {
  confirmPassword: string;
};

export interface RegisterResponse {
  _id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  token: string;
}
