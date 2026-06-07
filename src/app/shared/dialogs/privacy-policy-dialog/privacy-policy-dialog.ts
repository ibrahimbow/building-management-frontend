import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-privacy-policy-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatIconModule
  ],
  templateUrl: './privacy-policy-dialog.html',
  styleUrl: './privacy-policy-dialog.scss'
})
export class PrivacyPolicyDialog {
}