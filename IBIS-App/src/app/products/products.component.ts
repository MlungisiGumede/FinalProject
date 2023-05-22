import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { DeleteProductDialogComponent } from '../delete-product-dialog/delete-product-dialog.component';




@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  data:any
  products: Product[] = [];
  idtodelete :any;

  constructor(private productService: ProductService,public router: Router,
    private dialog: MatDialog, public overlaydelete: DeleteProductDialogComponent) { 
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

    this.router.navigate(['/AddProduct']);

  }

  deleteProduct(product: Product){
    const dialogRef = this.dialog.open(DeleteProductDialogComponent, { 
      width: '400px',
      data: { id: product.productID}
    }); 

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if(confirm){
        this.productService.deleteProduct(product.productID).subscribe(() => {
          this.products = this.products.filter(p => p.productID !== product.productID);
        })
      }
    })
  }
  
  

 
}


