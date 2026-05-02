import { Injectable } from '@angular/core';

export type UserRole = 'TENANT' | 'MANAGER' | 'ADMIN';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role: UserRole = 'MANAGER'; // change later from JWT

  getRole(): UserRole {
    return this.role;
  }

  isManagerOrAdmin(): boolean {
    return this.role === 'MANAGER' || this.role === 'ADMIN';
  }
}