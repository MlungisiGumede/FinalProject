import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipesComponent } from '../recipes/recipes.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RecipesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: RecipesComponent}]),
    MatCardModule,
    MatButtonModule,
  ],
})
export class RecipesModule {}