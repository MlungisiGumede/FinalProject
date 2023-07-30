import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../Services/recipe.service';
import { Router } from '@angular/router';
import { Recipe } from '../Models/Recipes';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {
  data:any;
  recipe!: Recipe;
  success=false;

  constructor(private recService: RecipeService,public router:Router,private toastController: ToastController) {
    this.data = new Recipe();
   }

  ngOnInit(): void {
  }


  createRecipe(){

    this.recService.createRecipe(this.data).subscribe(res=>{
    console.log("success", res);
    this.success = true
    this.presentToast('top')
    this.router.navigate(["/Recipes"])
    })
    

    }

    async presentToast(position: 'top' | 'middle' | 'bottom') {
      const toast = await this.toastController.create({
        message: 'Recipe successfully created',
        duration: 5000,
        position: position,
        color: 'success'
      });
  
      await toast.present();
    }




}
