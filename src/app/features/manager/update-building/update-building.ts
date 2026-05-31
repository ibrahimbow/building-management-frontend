import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { BuildingService } from '../../../core/services/building.service';
import { UpdateBuildingRequest } from '../../../core/models/building.model';

@Component({
  selector: 'app-update-building',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './update-building.html',
  styleUrl: './update-building.scss'
})
export class UpdateBuilding implements OnInit {

  private readonly buildingService = inject(BuildingService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  buildingId = '';

  buildingName = '';
  address = '';
  totalApartments: number | null = null;
  emergencyPhone = '';

  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    this.buildingId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.buildingId) {
      this.errorMessage = 'Building id is missing.';
      this.isLoading = false;
      return;
    }

    this.loadBuilding();
  }

  get isFormReady(): boolean {
    return this.isBuildingNameValid() &&
      this.isAddressValid() &&
      this.isTotalApartmentsValid() &&
      this.isEmergencyPhoneValid();
  }

  updateBuilding(form: NgForm): void {
    this.errorMessage = '';
    this.trimFormValues();

    if (form.invalid || !this.isFormReady) {
      form.control.markAllAsTouched();
      this.errorMessage = 'Please correct the highlighted fields.';
      return;
    }

    const request: UpdateBuildingRequest = {
      buildingName: this.buildingName,
      address: this.address,
      totalApartments: Number(this.totalApartments),
      emergencyPhone: this.emergencyPhone
    };

    this.isSubmitting = true;

    this.buildingService.updateMyBuilding(this.buildingId, request).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.snackBar.open('Building updated successfully.', 'Close', {
          duration: 2500
        });

        this.router.navigateByUrl('/manager/dashboard');
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 404) {
          this.errorMessage = 'Building was not found or you do not have access.';
          return;
        }

        if (err.status === 400) {
          this.errorMessage = 'Some fields are invalid. Please check your building details.';
          return;
        }

        this.errorMessage = 'Could not update building. Please try again.';
      }
    });
  }

  private loadBuilding(): void {
    this.buildingService.getMyBuildingById(this.buildingId).subscribe({
      next: (building) => {
        this.buildingName = building.buildingName;
        this.address = building.address;
        this.totalApartments = building.totalApartments;
        this.emergencyPhone = building.emergencyPhone;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load building details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private trimFormValues(): void {
    this.buildingName = this.buildingName.trim();
    this.address = this.address.trim();
    this.emergencyPhone = this.emergencyPhone.trim();
  }

  private isBuildingNameValid(): boolean {
    const value = this.buildingName.trim();
    return value.length >= 2 && value.length <= 80;
  }

  private isAddressValid(): boolean {
    const value = this.address.trim();
    return value.length >= 5 && value.length <= 150;
  }

  private isTotalApartmentsValid(): boolean {
    return this.totalApartments !== null &&
      Number.isInteger(Number(this.totalApartments)) &&
      Number(this.totalApartments) >= 4 &&
      Number(this.totalApartments) <= 500;
  }

  isEmergencyPhoneValid(): boolean {
    const phone = this.emergencyPhone.trim();

    if (!phone) {
      return false;
    }

    const allowedCharactersPattern = /^\+?[0-9\s().-]+$/;

    if (!allowedCharactersPattern.test(phone)) {
      return false;
    }

    const digitCount = phone.replace(/\D/g, '').length;

    return digitCount >= 10 && digitCount <= 15;
  }
}