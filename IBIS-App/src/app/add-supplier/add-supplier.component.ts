import { Component, OnInit } from '@angular/core';
import { Supplier } from '../Models/Supplier';
import { SupplierService } from '../Services/supplier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  data: any;
  sup!: Supplier;
  constructor(private supply: SupplierService,public router:Router) { 

this.data = new Supplier();

  }

  ngOnInit(): void {

  }


createSupplier(){

this.supply.createSupplier(this.data).subscribe(res=>{
console.log("success", res);
})

}



}
