import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateProductComponent } from '../create-product/create-product.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CreateProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: CreateProductComponent}]),
    MatCardModule,
    MatButtonModule,
  ],
})
export class CreateProductModule {}