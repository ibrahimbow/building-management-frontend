import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BuildingService } from '../../../core/services/building.service';
import { CreateBuildingRequest } from '../../../core/models/building.model';

@Component({
  selector: 'app-create-building',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './create-building.html',
  styleUrl: './create-building.scss'
})
export class CreateBuilding {

  private readonly buildingService = inject(BuildingService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  buildingName = '';
  address = '';
  totalApartments: number | null = null;
  emergencyPhone = '';

  isSubmitting = false;
  errorMessage = '';

  createBuilding(form: NgForm): void {
    this.errorMessage = '';

    if (form.invalid || this.totalApartments === null) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const request: CreateBuildingRequest = {
      buildingName: this.buildingName.trim(),
      address: this.address.trim(),
      totalApartments: this.totalApartments,
      emergencyPhone: this.emergencyPhone.trim()
    };

    this.isSubmitting = true;

    this.buildingService.createBuilding(request).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.snackBar.open('Building created successfully.', 'Close', {
          duration: 2500
        });

        this.router.navigateByUrl('/manager/dashboard');
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 409) {
          this.errorMessage = 'You already manage a building.';
          return;
        }

        this.errorMessage = 'Could not create building. Please try again.';
      }
    });
  }
}