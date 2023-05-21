import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';




@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  data:any
  products: Product[] = [];
  constructor(private productService: ProductService) { 
    productService = {} as ProductService;

  }

  ngOnInit() {
    this.getProducts()
  }

  getProducts(){
    this.productService.getProductsList().subscribe(result=>(this.data = result));
    console.log("data",this.products)

  }

  

 
}


