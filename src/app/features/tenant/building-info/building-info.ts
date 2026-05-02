import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-building-info',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './building-info.html',
  styleUrl: './building-info.scss'
})
export class BuildingInfo {
  building = {
    name: 'Residence Park View',
    code: 'BM-2026',
    address: '2600 Berchem (Antwerpen), Belgium',
    managerName: 'Building Manager',
    managerEmail: 'manager@building.com',
    totalApartments: 24,
    emergencyPhone: '+32 000 000 000'
  };
}