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

  constructor(private prodService: ProductService,public router:Router){
    this.data = new Product();
  } 

  ngOnInit(): void {

  }



  createProduct(){
    this.prodService.createProduct(this.data).subscribe(res=>{
    console.log("success", res);
    })  
  }

}
