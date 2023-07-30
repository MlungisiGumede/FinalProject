import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  data:any
  products: Product[] = [];
  idtodelete :any;
  search= "";

  constructor(private productService: ProductService,public router: Router) { 
    productService = {} as ProductService;

  }

  ngOnInit() {
    this.getProducts()
  }

  getProducts(){
    this.productService.getProductList().subscribe(response => {
      console.log(response);
      this.data = response;
    })
    

  }


  async delete(id: number){
    this.idtodelete = id;

this.productService.delete(this.idtodelete).subscribe(Response => {
  console.log(Response);
  this.data = Response;
this.getProducts();
})
  }


  addproduct(){

    this.router.navigate(['/add-product']);

  }

  

 
}


