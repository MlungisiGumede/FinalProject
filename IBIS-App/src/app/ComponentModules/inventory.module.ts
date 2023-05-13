import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryComponent } from '../inventory/inventory.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [InventoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: InventoryComponent}]),
    MatCardModule,
    MatButtonModule,
  ],
})
export class InventoryModule {}