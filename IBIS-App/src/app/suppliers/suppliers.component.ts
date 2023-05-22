import { Component, OnInit } from '@angular/core';
import { Supplier } from '../Models/Supplier';
import { SupplierService } from '../Services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  data: any;
  Suppliers : Supplier[]=[];

id: any;

  constructor(private supply: SupplierService,public router: Router,private route: ActivatedRoute) { 

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



  addsupplier(){
  

      this.router.navigate(['/AddProduct']);
  
    }
  }


