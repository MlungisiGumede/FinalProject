import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DeleteProductDialogComponent } from '../delete-product-dialog/delete-product-dialog.component';

@NgModule({
  declarations: [ProductsComponent,DeleteProductDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ProductsComponent}]),
    MatCardModule,
    MatButtonModule,
    
  ],
})
export class ProductsModule {}