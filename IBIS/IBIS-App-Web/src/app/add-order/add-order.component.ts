import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../Services/orders.service';
import { Orders } from '../Models/Orders';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  data:any;
  orders!: Orders;

  constructor(private ord: OrdersService,public router:Router) {
    this.data = new Orders();
   }

  ngOnInit(): void {
  }

  createOrders(){

    this.ord.createOrder(this.data).subscribe(res=>{
    console.log("success", res);
    })
    
    }

}
