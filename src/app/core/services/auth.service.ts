import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterRequest, User, UserRole } from '../models/user.model';
import { Observable, tap } from 'rxjs';

interface BackendLoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

interface BackendRegisterResponse {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/api/auth';
  private readonly CURRENT_USER_KEY = 'bm_current_user';
  private readonly TOKEN_KEY = 'bm_access_token';
  private readonly REFRESH_TOKEN_KEY = 'bm_refresh_token';

  private http = inject(HttpClient);

  constructor(private router: Router) { }

  
  register(request: RegisterRequest): Observable<BackendRegisterResponse> {
    return this.http.post<BackendRegisterResponse>(`${this.API}/register`, {
      username: request.name,
      email: request.email,
      password: request.password,
      nickname: request.nickname,
    });
  }

  login(usernameOrEmail: string, password: string): Observable<BackendLoginResponse> {
    return this.http.post<BackendLoginResponse>(`${this.API}/login`, {
      usernameOrEmail,
      password,
    }).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      })
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API}/profile`).pipe(
      tap(user => {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
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
    return !!this.getToken();
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

    if (role === 'ADMIN' || role === 'MANAGER') {
      return '/manager/dashboard';
    }

    return '/tenant/dashboard';
  }

  updatePassword(_newPassword: string): boolean {
    // TODO: backend endpoint later
    return false;
  }
}