export type UserRole = 'TENANT' | 'MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nickname: string;
  token?: string;
  password?: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  nickname: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}