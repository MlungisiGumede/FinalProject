import { Component, OnInit } from '@angular/core';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

data:any;
prod!: Product;
categories:any
subCategories:any
form!: FormGroup;

selectedCategory: string | null = null;

// categories: string[] = ['Meat', 'Vegetables', 'Sides'];
//   subcategories: { [key: string]: string[] } = {
//     'Meat': ['Pork', 'Beef', 'Lamb', 'Chicken', 'Fish'],
//     'Vegetables': ['Pumpkin', 'Lettuce', 'Potatoes', 'Butternut'],
//     'Sides': ['Chakalaka', 'Atchaar']
//   };
  filteredSubcategories: any


  constructor(private prodService: ProductService, public router:Router,
     private fb: FormBuilder, private toastController: ToastController){
    this.data = new Product();
    this.prodService.getCategoriesList().subscribe((res)=>{
      console.log(res)
      this.categories = res
    })
    this.prodService.getSubCategoriesList().subscribe((res)=>{
      console.log(res)
      this.subCategories = res
    })
  } 

  ngOnInit(): void {

    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      expiry: [null, [Validators.required, this.minExpiryDateValidator.bind(this)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      subCategory_ID: [null, Validators.required],
      category_ID: [null, Validators.required]
    });


    
  }

  minExpiryDateValidator(control: any): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minExpiryDate = new Date(today);
    minExpiryDate.setDate(today.getDate() + 10); // Minimum expiry date is 10 days from now

    if (selectedDate < minExpiryDate) {
      return { 'minExpiryDate': true };
    }
    return null;
  }
  
  validateExpiryDate() {
    const expiryDateControl = this.form.get('expiryDate');
    if (expiryDateControl) {
      expiryDateControl.updateValueAndValidity();
    }
  }

 

  AddProduct(){

    // let newProd = new Product()
    // newProd.name = this.form.controls['productName'].value
    // newProd.price = this.form.controls['price'].value
    // newProd.category_ID = this.form.controls['category'].value
    // newProd.subCategory_ID = this.form.controls['subcategory'].value
    // newProd.quantity = this.form.controls['quantity'].value
    // newProd.expiry = this.form.controls['expiryDate'].value
    console.log(this.form)
console.log(this.form.value)

    this.prodService.createProduct(this.form.value).subscribe(res => {
      console.log('success', res);
      this.presentToast('top');
      this.router.navigate(["/Products"]);
    })

    // this.prodService.createProduct(this.data).subscribe(res=>{
    // console.log("success", res);
    // })  
  }

  onCategoryChange(event: any) {
    this.form.get('subCategory_ID')?.setValue(null);
    const selectedCategory = event.target.value;
    this.selectedCategory = selectedCategory;
    this.filteredSubcategories = []
    console.log(this.subCategories)
    this.subCategories.forEach((element:any) => {
      console.log(element)
      if(element.category_ID == selectedCategory){
        this.filteredSubcategories.push(element)
      }
    });
    //this.filteredSubcategories = this.selectedCategory
    console.log(this.filteredSubcategories)
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Product successfully created',
      duration: 5000,
      position: position,
      color: 'success'
    });
  
    await toast.present();
  }

}

