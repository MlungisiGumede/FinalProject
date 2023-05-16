import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from '../reports/reports.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ReportsComponent}]),
    MatCardModule,
    MatButtonModule,
  ],
})
export class ReportsModule {}