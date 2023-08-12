import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Orders } from '../Models/Orders';
import { Router } from '@angular/router';
import { OrdersService } from '../Services/orders.service';
import { SupplierService } from '../Services/supplier.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  data:any
  ord: Orders[] = [];
  idtodelete :any;
  search= "";

  constructor(public router: Router, private orderservice : SupplierService) { }

  ngOnInit(): void {
    this.getOrders()
  }

  getOrders(){
    this.orderservice.getSupplierList().subscribe(response => {
      console.log(response);
      this.data = response;
    })
    

  }


  async delete(id: number){
    this.idtodelete = id;

this.orderservice.delete(this.idtodelete).subscribe(Response => {
  console.log(Response);
  this.data = Response;
this.getOrders();
})
  }



  addOrder(){

    this.router.navigate(['/add-order']);

  }
}
