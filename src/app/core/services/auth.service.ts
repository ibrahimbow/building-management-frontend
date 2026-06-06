import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  User,
  UserRole,
  BuildingUserProfile,
  UpdateBuildingUserProfileRequest,
  ChangePasswordRequest
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  private readonly CURRENT_USER_KEY = 'bm_current_user';
  private readonly ACCESS_TOKEN_KEY = 'bm_access_token';
  private readonly REFRESH_TOKEN_KEY = 'bm_refresh_token';

  private readonly currentUserSubject = new BehaviorSubject<User | null>(
    this.getCurrentUser()
  );

  readonly currentUser$ = this.currentUserSubject.asObservable();

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      request
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      request
    ).pipe(
      tap(response => this.storeAuthResponse(response))
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);

    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as User;
    } catch {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      return null;
    }
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

  isAdmin(): boolean {
    return this.hasAnyRole(['ADMIN']);
  }

  getDashboardUrl(): string {
    const role = this.getRole();

    if (role === 'ADMIN') {
      return '/admin';
    }

    if (role === 'MANAGER') {
      return '/manager/dashboard';
    }

    return '/tenant/dashboard';
  }

  getProfile(): Observable<BuildingUserProfile> {
    return this.http.get<BuildingUserProfile>(
      `${this.apiUrl}/profile`
    );
  }

  updateProfile(
    request: UpdateBuildingUserProfileRequest
  ): Observable<BuildingUserProfile> {

    return this.http.put<BuildingUserProfile>(
      `${this.apiUrl}/profile`,
      request
    ).pipe(
      tap(updatedProfile => {
        const currentUser = this.currentUserSubject.value;

        if (!currentUser) {
          return;
        }

        const updatedCurrentUser: User = {
          ...currentUser,
          displayName: updatedProfile.displayName,
          phoneNumber: updatedProfile.phoneNumber,
          avatarUrl: updatedProfile.avatarUrl
        };

        localStorage.setItem(
          this.CURRENT_USER_KEY,
          JSON.stringify(updatedCurrentUser)
        );

        this.currentUserSubject.next(updatedCurrentUser);
      })
    );
  }

  updateCurrentUser(profile: BuildingUserProfile): void {
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      username: profile.username,
      email: profile.email,
      displayName: profile.displayName,
      phoneNumber: profile.phoneNumber,
      avatarUrl: profile.avatarUrl,
      role: profile.role
    };

    this.setCurrentUser(updatedUser);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/change-password`,
      request
    );
  }

  private storeAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(
      this.CURRENT_USER_KEY,
      JSON.stringify(user)
    );

    this.currentUserSubject.next(user);
  }
}