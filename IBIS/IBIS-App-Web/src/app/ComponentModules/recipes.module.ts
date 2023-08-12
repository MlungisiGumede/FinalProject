import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipesComponent } from '../recipes/recipes.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [RecipesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: RecipesComponent}]),
    MatCardModule,
    MatButtonModule,
    IonicModule.forRoot()
  ],
})
export class RecipesModule {}