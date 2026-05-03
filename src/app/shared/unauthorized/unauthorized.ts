import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="unauthorized">
      <h1>403</h1>
      <p>You are not allowed to access this page.</p>
      <a routerLink="/auth/login">Go to Login</a>
    </section>
  `,
  styles: [`
    .unauthorized {
      min-height: 100vh;
      display: grid;
      place-items: center;
      text-align: center;
      font-family: sans-serif;
    }

    h1 {
      font-size: 64px;
      margin: 0;
      color: #dc2626;
    }

    p {
      margin: 10px 0;
      color: #334155;
    }

    a {
      color: #2563eb;
      font-weight: bold;
      text-decoration: none;
    }
  `]
})
export class Unauthorized {}