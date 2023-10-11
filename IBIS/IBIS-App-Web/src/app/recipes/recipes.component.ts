import { Component, OnInit,ViewChild } from '@angular/core';
import { Recipe } from '../Models/Recipes';
import { RecipeService } from '../Services/recipe.service';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AiImageServiceService } from '../Services/ai-image-service.service';
import { RecipesHelpComponent } from '../recipes-help/recipes-help.component';
import { JsonpInterceptor } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
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
  title = 'OpenAI Image API';
  imageUrl ='';
  columnsSchema:any = [ {key:'recipe_Name',name:'Recipe Name'}, {key:'recipe_Ingredients',name:'Recipe Ingredients'}, {key:'actions',name:''}]
  displayedColumns: string[] = this.columnsSchema.map((x:any) => x.key);
  @ViewChild(MatPaginator) paginator!: MatPaginator
  dataSource:MatTableDataSource<any> = new MatTableDataSource<any>();
  constructor(private recService: RecipeService,public router: Router,private toastController: ToastController, 
    private aiService: AiImageServiceService,public helpModal: ModalController) {
    recService = {} as RecipeService;
   }

  ngOnInit(): void {
    this.getRecipes()
  }

  getRecipes(){
    this.recService.getRecipeList().subscribe(response => {
      console.log(response);
      this.data = response;
      let res:any = response
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator
      this.dataSource._updateChangeSubscription()
    })
    

  }
  filter(event:any){
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async generateImage(promtImage: string) {
    //const currentToken = localStorage.getItem('temp')
    const prompt = promtImage;
    const model = 'image-alpha-001';
    this.aiService.generateImage(prompt, model).subscribe((data:any) => {
      let token:any = localStorage.getItem('temp')
      console.log('current',token)
      
      localStorage.setItem('Token',token)
      this.imageUrl = data.data[0].url;
    });
    
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

  async showHelp(){
    const modal = await this.helpModal.create({
      component: RecipesHelpComponent});
      return await modal.present();
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
