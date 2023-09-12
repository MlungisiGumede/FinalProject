import { Component, OnInit,OnDestroy, Renderer2, Inject } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { of } from 'rxjs';
import { OrdersService } from '../Services/orders.service';
import { CustomerOrder } from '../Models/CustomerOrder';
import { CustomerService } from '../Services/customer.service';
import { valueOrDefault } from 'chart.js/dist/helpers/helpers.core';
import { DatePipe } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Route, Router } from '@angular/router';

declare let paypal:any;  

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
customerOrders:any = of([{}])
filterTerm:any
order = new CustomerOrder()
customerOrderLine:any
customer:any
welcome:any
total:any
//paypal:any
result:any
//script: HTMLScriptElement = new HTMLScriptElement;
  constructor(private loginservice: LoginService,private orderservice: OrdersService, private customerService:CustomerService
    ,private _route:Router){}
    //,private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
  this.GetCustomerOrders().then((res) => {
    this.GetCustomerOrdersLine().then((res) => {
      this.GetCustomer()
    })
  })
  
     // this.customerOrders = res
     
  
    
  }
  ConvertDate(date:any){
    //return 
    console.log(date)
    let inDate = new Date(date)
    let datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy/MM/dd');
    //return new Date(date)
     }
  async GetCustomerOrders(){
    let value = new Promise((resolve, reject) => {
      this.loginservice.getCustomerOrders().subscribe((res) => {
        console.log(res)
        this.customerOrders = of(res)
        this.order.customerOrder_ID = res[0].customerOrder_ID
        this.order.customer_ID = res[0].customer_ID
        resolve(res)
      }), (error: any) => {
        reject(error)
      }
    })
    await value
    return value
  }
  // loadExternalScript2(){
  //   this.script = this.renderer2.createElement('script');
  //   this.script.src = "https://www.paypal.com/sdk/js?client-id=[YOUR_CLIENT_ID]&currency=AUD";
  //   this.script.type = 'text/javascript';
  //   this.script.async = true;
  //   this.script.charset = 'utf-8';
  //   this.renderer2.appendChild(this.document.head, this.script);
  // }
  
    private loadExternalScript(scriptUrl: string) {
      return new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script')
        scriptElement.src = scriptUrl
        scriptElement.onload = resolve
        document.body.appendChild(scriptElement)
        //https://stackoverflow.com/questions/43806348/how-to-integrate-paypal-express-checkout-into-angular2-typescript-project
    })
  }
  Check(){
    this.orderservice.checkout.next("checkout")
   this._route.navigate(['payment']); // see oif works if not maybe comment out a line or something...
    
  }
//   CheckOut(url:any){
// this.loadExternalScript("https://www.paypalobjects.com/api/checkout.js").then(() => {
//   this.paypal.Buttons(
//     {
//       style: {
//         layout: 'horizontal',
//         color: 'blue',
//         shape: 'rect',
//         label: 'paypal',
//       },
//       createOrder: (data: any, actions: any) => {
//         return actions.order.create({
//           purchase_units: [
//             {
//               amount: {
//                 value: '1',
//                 currency_code: 'USD'
//               }
//             }
//           ]
//         });
//       },
//       onApprove: (data: any, actions: any) => {
//         return actions.order.capture().then((details: any) => {
//           if (details.status === 'COMPLETED') {
//             //this.payment.transactionID = details.id;
//             //this.router.navigate(['confirm']);
//           }
//         });
//       },
//       onError: (error: any) => {
//         console.log(error);
//       }
//     }
//   ),'#paypal'
// }
// )
// }
// Checkout2(){
//   this.loadExternalScript2()
//   this.script.onload = () => {
//     paypal.Buttons({
//       style: {
//         // https://developer.paypal.com/docs/checkout/integration-features/customize-button/
//         layout: 'vertical',
//         color: 'blue',
//         shape: 'rect',
//         label: 'paypal'
//       },
//       createOrder: (data:any, actions:any) => {
//         return actions.order.create({
//           purchase_units: [
//             {
//               //description: this.product.description,
//               amount: {
//                 currency_code: 'USD',
//                 value: '0,01'
//               }
//             }
//           ]
//         });
//       },
//       onCancel: (data:any) => {
//         // Show a cancel page, or return to cart
//         // https://developer.paypal.com/docs/checkout/integration-features/cancellation-page/
//       },
//       onShippingChange: (data:any, actions:any) => {
//         // https://developer.paypal.com/docs/checkout/integration-features/shipping-callback/
//         // ...
//       },
//       onApprove: async (data:any, actions:any) => {
//         const order = await actions.order.capture();
//         console.log(order);
//         this.result = order.id + "  " + order.status;
//       },
//       onError: (err:any) => {
//         // https://developer.paypal.com/docs/checkout/integration-features/handle-errors/
//         console.log(err);
//         this.result = err;
//       }
//     })
//       .render("#paypal-button");
//   }
// }
  CalculateTotal(id:any){
    let total = 0

  this.customerOrderLine.forEach((element:any) => {
   console.log(element)
    if(element.customerOrder_ID == id){
      total = total + (element.quantity*element.price)
  }
})
this.total = total // just to test or something maybe remove...
return total
  }
  async GetCustomerOrdersLine(){
    let value = new Promise((resolve, reject) => {
      this.orderservice.getCustomerOrderLine(this.order).subscribe((res) => { 
        this.customerOrderLine = res
        resolve(res)
      }), (error: any) => {
        reject(error)
      }
    })
    await value
    return value
  }
  async GetCustomer(){
    let value = new Promise((resolve, reject) => {
      console.log(this.order)
      this.customerService.getCustomer(this.order.customer_ID).subscribe((res) => {
        this.customer = res
        this.welcome = "Welcome: " + res.customer_FirstName + " " + res.customer_Surname
        resolve(res)
      }), (error: any) => {
        reject(error)
      }
    })
    await value
    return value
  }
 

}
