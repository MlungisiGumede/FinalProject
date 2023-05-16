import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuppliersComponent } from '../suppliers/suppliers.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SuppliersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SuppliersComponent}]),
    MatCardModule,
    MatButtonModule,
  ],
})
export class SuppliersModule {}