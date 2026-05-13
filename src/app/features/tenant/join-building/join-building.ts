import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BuildingService } from '../../../core/services/building.service';

@Component({
  selector: 'app-join-building',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
    if (form.invalid || this.isSubmitting || !this.buildingCode.trim()) {
      form.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.buildingService.joinBuilding(this.buildingCode.trim()).pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Successfully joined building.', 'Close', {
          duration: 2500
        });

        this.router.navigateByUrl('/tenant/building-info');
      },
      error: () => {
        this.snackBar.open('Invalid building code or already joined.', 'Close', {
          duration: 3000
        });
      }
    });
  }
}