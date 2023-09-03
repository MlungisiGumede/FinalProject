import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../Models/Product';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  id:any;
  data:any;
  categories:any
  subCategories:any
  filteredSubcategories: any
  selectedCategory: any;

  form!: FormGroup;

  constructor(private route : ActivatedRoute, private fb : FormBuilder,private prod: ProductService,
    @Inject(MAT_DIALOG_DATA) public item: any,private dialogRef: MatDialogRef<ViewProductComponent>,
    private prodService: ProductService) { }

  ngOnInit(): void {
  this.categories = this.item.categories
  this.subCategories = this.item.subCategories
  console.log(this.categories)
  console.log(this.subCategories)
    this.onCategoryChange(this.item.product.category_ID)
    this.form = this.fb.group({
      product_ID : [this.item.product.product_ID,],
      name : [this.item.product.name, Validators.required],
      category_ID: [this.item.product.category_ID, Validators.required],
      subCategory_ID : [this.item.product.subCategory_ID, Validators.required],
      price : [this.item.product.price, Validators.required],
     // phone : ['', Validators.required],
      quantity : [this.item.product.quantity, Validators.required],
      expiry :  [this.item.product.expiry, Validators.required]
    })
   

    

    
    

  
}
validateExpiryDate() {
  const expiryDateControl = this.form.get('expiryDate');
  if (expiryDateControl) {
    expiryDateControl.updateValueAndValidity();
  }
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

onCategoryChange(value: any) {
  if(this.form){
    console.log(this.form.value)
    this.form.get('subCategory_ID')?.setValue(null);
  }
  
  const selectedCategory = value
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


  update(){

    this.prod.updateProduct(this.form.value).subscribe(response => {
      console.log("successfully updated",response);
      this.dialogRef.close(true);
  }), (error:any) => {
    console.log(error);
    this.dialogRef.close(false);
  };
}

  submit(){



  }

}


