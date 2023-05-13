import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateUserAccountComponent } from './create-user-account/create-user-account.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CreateUserAccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: CreateUserAccountComponent}]),
    MatCardModule,
    MatButtonModule,
  ],
})
export class CreateUserAccountModule {}