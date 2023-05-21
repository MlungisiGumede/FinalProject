import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AddProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AddProductComponent}]),
    MatCardModule,
    MatButtonModule,
  ],
})
export class AddProductModule {}