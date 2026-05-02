import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { UserStateService } from '../../../core/user/user-state.service';

@Component({
  selector: 'app-join-building',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './join-building.html',
  styleUrl: './join-building.scss'
})
export class JoinBuilding {

  buildingCode = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private userState: UserStateService,
    private router: Router
  ) {}

  joinBuilding() {

    if (!this.buildingCode) {
      this.errorMessage = 'Please enter a building code';
      this.successMessage = '';
      return;
    }

    // Mock validation
    if (this.buildingCode === 'BM-2026') {
      this.userState.hasJoinedBuilding = true;

      this.successMessage = 'Successfully joined building!';
      this.errorMessage = '';

      setTimeout(() => {
        this.router.navigate(['/tenant/dashboard']);
      }, 1000);

    } else {
      this.errorMessage = 'Invalid building code';
      this.successMessage = '';
    }
  }
}