import { Component, OnInit } from '@angular/core';
import { Supplier } from '../Models/Supplier';
import { SupplierService } from '../Services/supplier.service';



@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  data: any;
  Suppliers : Supplier[]=[];



  constructor(private supply: SupplierService) { 

    supply = {} as SupplierService;
  }

  ngOnInit() {

this.getall();

  }



  getall(){

    this.supply.getSupplierList().subscribe(response => {
      console.log(response);
      this.data = response;
    })

  }

}
