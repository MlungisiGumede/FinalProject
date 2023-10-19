import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../Services/orders.service';
import { CustomerOrder } from '../Models/CustomerOrder';
import { ModalController } from '@ionic/angular';
import { PaymentHelpComponent } from '../payment-help/payment-help.component';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  totalR:any
  total$:any
  randToUsd:any
  customerOrder:CustomerOrder = new CustomerOrder()
 
  @ViewChild('paymentRef', {static: true}) paymentRef!: ElementRef;

  constructor(private router: Router,private orderService:OrdersService,public helpModal: ModalController,
    private _snackbar: MatSnackBar) {
    //let a = Math.round(this.total$^2)/10^2
   }

  ngOnInit(): void {
    this.orderService.orderVM.subscribe((res:any)=>{
      this.totalR = res.total
      console.log(res)
      this.customerOrder.customerOrder_ID = res.customerOrder_ID
      console.log(this.customerOrder)
      console.log(this.totalR)

      this.orderService.getCurrency().subscribe((res:any)=>{
        const rates = res.rates;
        console.log(rates['RSA'])
        this.randToUsd = 1/rates['ZAR']
      this.total$ = this.totalR *  this.randToUsd // * 0.052 
      console.log(this.total$)
      this.total$ = (Math.round(this.total$ * 100) / 100).toFixed(2) // just round down instead...
      console.log(this.total$)
         console.log(this.randToUsd)
          //this.total$ = 11
        this.RenderPayPal()
        
      })
    })
 
 
  
  }
  ListenToRender(){
    this.orderService.checkout.subscribe( ()=>{
      console.log("rendered")
      this.RenderPayPal()
    }
      
    )
    
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: PaymentHelpComponent});
      return await modal.present();
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
                  value: (Math.round(this.total$ * 100) / 100).toFixed(2),
                  currency_code: 'USD',
                }
              }
            ]
          });
        },
        onApprove: (data: any, actions: any) => {
          console.log(data)
          return actions.order.capture().then((details: any) => {
            console.log(details)
            if (details.status === 'COMPLETED') {
              this.transactionID = details.id;
              alert(this.transactionID)
              console.log(details)
              this.customerOrder.transaction_ID = this.transactionID
              this.ShowSnackBar("Payment Successful with transaction ID"+this.transactionID, "success")
              this.orderService.UpdateCustomerOrderStatus(this.customerOrder).subscribe()
              this.orderService.orderVM.next("yeah")
              this.router.navigate(['customer-view']);
             
            }
          });
        },
        onError: (error: any) => {
          this.ShowSnackBar("Transactiion failed"+this.transactionID, "error")
          console.log(error);
        }
      }
    ).render(this.paymentRef.nativeElement);
  }

  cancel() {
    this.router.navigate(['customer-view']);
  }
  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }


}
