import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  name = '';
  email = '';
  password = '';
  nickname = '';

  constructor(
    private authService: AuthService,
    private router: Router) {}

register(): void {

  if (this.password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  const success = this.authService.register({
    id: crypto.randomUUID(),
    name: this.name,
    email: this.email,
    password: this.password,
    role: 'TENANT',
    nickname: this.nickname
  });

  if (!success) {
    alert('User already exists');
    return;
  }

  alert('Registered successfully');
  this.router.navigate(['/auth/login']);
}
}