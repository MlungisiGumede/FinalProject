import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewUserComponent } from '../view-user/view-user.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ViewUserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ViewUserComponent}]),
    MatCardModule,
    MatButtonModule,
  ],
})
export class ViewUsersModule {}