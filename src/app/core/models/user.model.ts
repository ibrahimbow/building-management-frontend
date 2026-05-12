export type UserRole = 'TENANT' | 'MANAGER' | 'ADMIN';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  role: UserRole;
  enabled: boolean;
}