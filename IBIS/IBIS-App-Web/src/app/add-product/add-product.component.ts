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

productForm!: FormGroup;

selectedCategory: string | null = null;

categories: string[] = ['Meat', 'Vegetables', 'Sides'];
  subcategories: { [key: string]: string[] } = {
    'Meat': ['Pork', 'Beef', 'Lamb', 'Chicken', 'Fish'],
    'Vegetables': ['Pumpkin', 'Lettuce', 'Potatoes', 'Butternut'],
    'Sides': ['Chakalaka', 'Atchaar']
  };
  filteredSubcategories: string[] | undefined;


  constructor(private prodService: ProductService, public router:Router,
     private fb: FormBuilder, private toastController: ToastController){
    this.data = new Product();
  } 

  ngOnInit(): void {

    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      expiryDate: [null, [Validators.required, this.minExpiryDateValidator.bind(this)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      subcategory: [null, Validators.required],
      category: [null, Validators.required]
    });


    this.productForm.get('category')?.valueChanges.subscribe(() => {
      // Update the 'subcategory' control value and validation when category changes
      this.productForm.get('subcategory')?.setValue(null);
      this.productForm.get('subcategory')?.setValidators(Validators.required);
      this.productForm.get('subcategory')?.updateValueAndValidity();
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
    const expiryDateControl = this.productForm.get('expiryDate');
    if (expiryDateControl) {
      expiryDateControl.updateValueAndValidity();
    }
  }

  submitProductForm(){
    if(this.productForm.valid){
      this.createProduct();
      console.log('Form is valid, submitting...');
    }
  }

  createProduct(){

    let newProd = new Product()
    newProd.name = this.productForm.controls['productName'].value
    newProd.price = this.productForm.controls['price'].value
    newProd.category = this.productForm.controls['category'].value
    newProd.subcategory = this.productForm.controls['subcategory'].value
    newProd.quantity = this.productForm.controls['quantity'].value
    newProd.expiry = this.productForm.controls['expiryDate'].value

    this.prodService.createProduct(newProd).subscribe(res => {
      console.log('success', res);
      this.presentToast('top');
      this.router.navigate(["/Products"]);
    })

    // this.prodService.createProduct(this.data).subscribe(res=>{
    // console.log("success", res);
    // })  
  }

  onCategoryChange(event: any) {
    const selectedCategory = event.target.value;
    this.selectedCategory = selectedCategory;
    this.filteredSubcategories = this.selectedCategory
    ? this.subcategories[this.selectedCategory] || []
    : [];
    console.log('Selected Category:',  this.filteredSubcategories, this.subcategories);
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

