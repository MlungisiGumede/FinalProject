import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductReportComponent } from '../product-report/product-report.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ProductReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ProductReportComponent}]),
    MatCardModule,
    MatButtonModule,
    IonicModule,
    IonicModule.forRoot()
  ],
})
export class ProductReportModule {}