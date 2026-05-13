import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BuildingService } from '../../../core/services/building.service';

@Component({
  selector: 'app-join-building',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './join-building.html',
  styleUrl: './join-building.scss'
})
export class JoinBuilding {

  private readonly buildingService = inject(BuildingService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  buildingCode = '';

  isSubmitting = false;

  joinBuilding(form: NgForm): void {

    if (form.invalid || this.isSubmitting) {
      form.form.markAllAsTouched();
      return;
    }

    const code = this.buildingCode.trim();

    if (!code) {
      return;
    }

    this.isSubmitting = true;

    this.buildingService.joinBuilding(code).pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {

        this.snackBar.open(
          'Successfully joined building.',
          'Close',
          {
            duration: 2500
          }
        );

        this.router.navigateByUrl('/tenant/dashboard');
      },
      error: () => {

        this.snackBar.open(
          'Invalid building code or already joined.',
          'Close',
          {
            duration: 3000
          }
        );
      }
    });
  }
}