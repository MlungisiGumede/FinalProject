import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersComponent } from '../orders/orders.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: OrdersComponent}]),
    MatCardModule,
    MatButtonModule,
    IonicModule.forRoot()
  ],
})
export class OrderModule {}