import { Component, OnInit } from '@angular/core';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

data:any;
prod!: Product;
<<<<<<< HEAD
=======

productForm!: FormGroup;

selectedCategory: string | null = null;
>>>>>>> parent of 1c513418 (Merge branch 'main' of https://github.com/INF370Development/inf370-team6)

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
<<<<<<< HEAD
    this.prodService.createProduct(this.data).subscribe(res=>{
    console.log("success", res);
    })  
=======

    let newProd = new Product()
    newProd.product_Name = this.productForm.controls['productName'].value
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
>>>>>>> parent of 1c513418 (Merge branch 'main' of https://github.com/INF370Development/inf370-team6)
  }

  updateSubcategories() {
    this.data.subcategory = ''; // Reset subcategory when category changes
  }

}
