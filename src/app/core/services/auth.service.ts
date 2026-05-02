import { Injectable } from '@angular/core';

export type UserRole = 'TENANT' | 'MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  nickname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USERS_KEY = 'bm_users';
  private readonly CURRENT_USER_KEY = 'bm_current_user';

  // ========================
  // REGISTER
  // ========================
  register(user: User): boolean {
    const users = this.getUsers();

    const exists = users.find(u => u.email === user.email);
    if (exists) return false;

    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    return true;
  }

  // ========================
  // LOGIN
  // ========================
  login(email: string, password: string): boolean {
    const users = this.getUsers();

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) return false;

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    return true;
  }

  // ========================
  // LOGOUT
  // ========================
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // ========================
  // CURRENT USER
  // ========================
  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  getRole(): UserRole {
    return this.getCurrentUser()?.role || 'TENANT';
  }

  isManagerOrAdmin(): boolean {
    const role = this.getRole();
    return role === 'MANAGER' || role === 'ADMIN';
  }

  // ========================
  // HELPERS
  // ========================
  private getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }


  // ========================
  // updatePassword
  // ========================
  updatePassword(newPassword: string): void {
  const currentUser = this.getCurrentUser();

  if (!currentUser) return;

  const users = this.getUsers().map(user =>
    user.id === currentUser.id
      ? { ...user, password: newPassword }
      : user
  );

  const updatedCurrentUser = {
    ...currentUser,
    password: newPassword
  };

  localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedCurrentUser));
}
}