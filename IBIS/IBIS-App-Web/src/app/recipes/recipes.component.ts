import { Component, OnInit } from '@angular/core';
import { Recipe } from '../Models/Recipes';
import { RecipeService } from '../Services/recipe.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  data:any
  recipe: Recipe[] = [];
  idtodelete :any;
  filterTerm!: string;
  isModalOpen = false;

  constructor(private recService: RecipeService,public router: Router,private toastController: ToastController) {
    recService = {} as RecipeService;
   }

  ngOnInit(): void {
    this.getRecipes()
  }

  getRecipes(){
    this.recService.getRecipeList().subscribe(response => {
      console.log(response);
      this.data = response;
    })
    

  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  async delete(id: number){
    this.idtodelete = id;

this.recService.delete(this.idtodelete).subscribe(Response => {
  console.log(Response);
  this.data = Response;
this.getRecipes();
this.presentToast('top')
})
  }


  addRecipe(){

    this.router.navigate(['/create-recipe']);

  }


  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Recipe successfully removed',
      duration: 5000,
      position: position,
      color: 'success'
    });

    await toast.present();
  }

  


}
