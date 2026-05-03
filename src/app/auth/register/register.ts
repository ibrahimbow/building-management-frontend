import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  name = '';
  email = '';
  password = '';
  nickname = '';
  role: UserRole = 'TENANT';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(): void {
    this.errorMessage = '';

    if (!this.name || !this.email || !this.nickname || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isSubmitting = true;

    const success = this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      nickname: this.nickname,
      role: this.role,
    });

    this.isSubmitting = false;

    if (!success) {
      this.errorMessage = 'An account already exists with this email.';
      return;
    }

    this.router.navigate(['/auth/login']);
  }
}