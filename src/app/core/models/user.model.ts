export type UserRole = 'TENANT' | 'MANAGER' | 'ADMIN';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface RegisterResponse {
  id: number;
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
  avatarUrl: string | null;
  role: UserRole;
  enabled: boolean;
}

export interface BuildingUserProfile {
  id: number;
  username: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  avatarUrl: string | null;
  preferredLanguage: string | null;
  notificationsEnabled: boolean | null;
  role: UserRole;
}

export interface UpdateBuildingUserProfileRequest {
  displayName: string;
  phoneNumber: string;
  avatarUrl: string | null;
  preferredLanguage: string | null;
  notificationsEnabled: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}