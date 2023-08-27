import { Component, OnInit } from '@angular/core';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

data:any;
prod!: Product;
form!:FormGroup

categories: string[] = ['Meat', 'Vegetables', 'Sides'];
  subcategories: { [key: string]: string[] } = {
    'Meat': ['Pork', 'Beef', 'Lamb', 'Chicken', 'Fish'],
    'Vegetables': ['Pumpkin', 'Lettuce', 'Potatoes', 'Butternut'],
    'Sides': ['Chakalaka', 'Atchaar']
  };


  constructor(private prodService: ProductService,public router:Router){
    this.data = new Product();
  } 

  ngOnInit(): void {
    this.form = new FormGroup({
     name: new FormControl("",Validators.required), // fill with the API calls...
      category: new FormControl("",Validators.required),
      subCategory: new FormControl("",Validators.required),
      price: new FormControl("",Validators.required),
      quantity: new FormControl("",Validators.required),
      expiry: new FormControl("",Validators.required)
    })
  }

  CreateProduct(){
    let product:Product = new Product()
    product = this.form.value
    this.prodService.createProduct(product).subscribe(res=>{
    console.log("success", res);
    })  
  }

  updateSubcategories() {
    this.data.subcategory = ''; // Reset subcategory when category changes
  }

}
