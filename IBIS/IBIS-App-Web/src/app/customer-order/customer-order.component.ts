import { Component, OnInit } from '@angular/core';
import { Orders } from '../Models/Orders';
import { OrdersService } from '../Services/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.css']
})
export class CustomerOrderComponent implements OnInit {
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
