import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../Services/orders.service';
//declare let paypal:any
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
//code online -- https://github.com/freelancer-surender/Angular---Hero-to-Superhero/blob/master/payment/src/app/payment/payment.component.html>
export class PaymentComponent implements OnInit {
// code from the internet...
  transactionID:any
  amount = 0.01;
  paypal:any
  @ViewChild('paymentRef', {static: true}) paymentRef!: ElementRef;

  constructor(private router: Router,private orderService:OrdersService) { }

  ngOnInit(): void {
  this.RenderPayPal()
    
  }
  ListenToRender(){
    this.orderService.checkout.subscribe( ()=>{
      console.log("rendered")
      this.RenderPayPal()
    }
      
    )
    
  }
 public RenderPayPal(){
  //console.log(window.paypal)
    window.paypal.Buttons(
      {
        // style: {
        //   layout: 'horizontal',
        //   color: 'blue',
        //   shape: 'rect',
        //   label: 'paypal',
        // },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.amount.toString(),
                  currency_code: 'USD'
                }
              }
            ]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            if (details.status === 'COMPLETED') {
              this.transactionID = details.id;
              console.log("success")
              this.router.navigate(['confirm']);
            }
          });
        },
        onError: (error: any) => {
          console.log(error);
        }
      }
    ).render(this.paymentRef.nativeElement);
  }

  cancel() {
    this.router.navigate(['customer-view']);
  }


}
