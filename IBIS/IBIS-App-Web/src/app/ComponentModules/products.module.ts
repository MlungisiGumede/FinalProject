import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ProductsComponent}]),
    MatCardModule,
    MatButtonModule,
    IonicModule.forRoot()
  ],
})
export class ProductsModule {}