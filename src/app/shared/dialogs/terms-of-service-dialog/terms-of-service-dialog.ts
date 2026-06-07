import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-terms-of-service-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatIconModule
  ],
  templateUrl: './terms-of-service-dialog.html',
  styleUrl: './terms-of-service-dialog.scss'
})
export class TermsOfServiceDialog {
}