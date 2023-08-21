import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WriteOffService } from '../Services/write-off.service';

@Component({
  selector: 'app-view-write-offs',
  templateUrl: './view-write-offs.component.html',
  styleUrls: ['./view-write-offs.component.css']
})
export class ViewWriteOffsComponent implements OnInit {

  data:any
  products: Product[] = [];
  idtodelete :any;
  filterTerm!: string;
  
  constructor(private writeOffService: WriteOffService,public router: Router) { 
    writeOffService = {} as WriteOffService;

  }

  ngOnInit() {
    this.getProducts()
  }

  getProducts(){
    this.writeOffService.getWriteOffList().subscribe(response => {
      console.log(response);
      this.data = response;
    })
    

  }


  async delete(id: number){
    this.idtodelete = id;

this.writeOffService.delete(this.idtodelete).subscribe(Response => {
  console.log(Response);
  this.data = Response;
this.getProducts();
})
  }


  addWriteOff(){

    this.router.navigate(['/add-product']);

  }

  viewWriteoffs(){

    this.router.navigate(['/view-write-offs']);

  }

  

 
}


