import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, RegisterRequest, StoredUser, User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'bm_users';
  private readonly CURRENT_USER_KEY = 'bm_current_user';
  private readonly TOKEN_KEY = 'bm_access_token';

  constructor(private router: Router) { }

  register(request: RegisterRequest): boolean {
    const email = request.email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some(user => user.email === email)) {
      return false;
    }

    const user: StoredUser = {
      id: crypto.randomUUID(),
      name: request.name.trim(),
      email,
      password: request.password,
      role: request.role ?? 'TENANT',
      nickname: request.nickname.trim(),
    };

    localStorage.setItem(this.USERS_KEY, JSON.stringify([...users, user]));
    return true;
  }

  login(email: string, password: string): AuthResponse | null {
    const normalizedEmail = email.trim().toLowerCase();

    const user = this.getUsers().find(
      storedUser =>
        storedUser.email === normalizedEmail &&
        storedUser.password === password,
    );

    if (!user) {
      return null;
    }

    const token = `mock-jwt-${user.role.toLowerCase()}-${Date.now()}`;
    const currentUser = this.toPublicUser(user, token);

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser));
    localStorage.setItem(this.TOKEN_KEY, token);

    return { token, user: currentUser };
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) as User : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getToken();
  }

  getRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const role = this.getRole();
    return !!role && roles.includes(role);
  }


  isManagerOrAdmin(): boolean {
    return this.hasAnyRole(['MANAGER', 'ADMIN']);
  }

  getDashboardUrl(): string {
    const role = this.getRole();

    if (role === 'ADMIN' ||  role === 'MANAGER') return '/manager';

    return '/tenant/dashboard';
  }

  updatePassword(newPassword: string): boolean {
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      return false;
    }

    const users = this.getUsers();

    const updatedUsers = users.map(user => {
      if (user.id !== currentUser.id) {
        return user;
      }

      return {
        ...user,
        password: newPassword,
      };
    });

    localStorage.setItem(this.USERS_KEY, JSON.stringify(updatedUsers));

    return true;
  }


  private getUsers(): StoredUser[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) as StoredUser[] : [];
  }

private toPublicUser(user: StoredUser, token: string): User {
  return {
    ...user,
    token,
  };
}
}