import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../Services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css']
})
export class ViewRecipeComponent implements OnInit {
  id:any;
  data:any;

  viewrecipeform!: FormGroup;
  constructor(private route : ActivatedRoute, private fb : FormBuilder,private rec: RecipeService,private toastController: ToastController,public router:Router) { }

  ngOnInit(): void {

    
    this.id = this.route.snapshot.params['id']
    this.viewrecipeform = this.fb.group({

      recipe_ID : ['', Validators.required],
      recipe_Ingredients: ['', Validators.required],
      recipe_Name : ['', Validators.required]
    })
    
    this.id = this.route.snapshot.params['id']

this.rec.getrec(this.id).subscribe((res)=>{

this.data = res
res = this.viewrecipeform.value

console.log('Recipe:', this.data)
});
  
  }


  update(){

    this.rec.updateRecipe(this.id,this.data).subscribe(response => {
      console.log("successfully updated",response);
      this.presentToast('top')
      this.router.navigate(["/Recipes"])

  });
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
