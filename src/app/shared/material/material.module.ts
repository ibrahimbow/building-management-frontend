import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Material Modules */
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

/**
 * Grouped Material modules for clean reuse
 */
const MATERIAL_MODULES = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatBadgeModule,
  MatDividerModule
];

@NgModule({
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  exports: [
    CommonModule,
    ...MATERIAL_MODULES
  ]
})
export class MaterialModule {}