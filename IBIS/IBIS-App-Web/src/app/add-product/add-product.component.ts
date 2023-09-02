import { Component, OnInit } from '@angular/core';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

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


  constructor(private prodService: ProductService,public router:Router){
    this.data = new Product();
  } 

  ngOnInit(): void {

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
      //this.presentToast('top');
      this.router.navigate(["/Products"]);
    })

    // this.prodService.createProduct(this.data).subscribe(res=>{
    // console.log("success", res);
    // })  
  }

  updateSubcategories() {
    this.data.subcategory = ''; // Reset subcategory when category changes
  }

}
