import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = 'http://localhost:8080/api/auth';

  private readonly CURRENT_USER_KEY = 'bm_current_user';
  private readonly ACCESS_TOKEN_KEY = 'bm_access_token';
  private readonly REFRESH_TOKEN_KEY = 'bm_refresh_token';

  register(request: RegisterRequest): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.storeTokens(response))
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);

    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) as User : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const role = this.getRole();
    return !!role && roles.includes(role);
  }

  isManager(): boolean {
    return this.getRole() === 'MANAGER';
  }

  isTenant(): boolean {
    return this.getRole() === 'TENANT';
  }

  isManagerOrAdmin(): boolean {
    return this.hasAnyRole(['MANAGER', 'ADMIN']);
  }

  getDashboardUrl(): string {
    const role = this.getRole();

    if (role === 'ADMIN' || role === 'MANAGER') {
      return '/manager/dashboard';
    }

    return '/tenant/dashboard';
  }

  private storeTokens(response: AuthResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
  }
}