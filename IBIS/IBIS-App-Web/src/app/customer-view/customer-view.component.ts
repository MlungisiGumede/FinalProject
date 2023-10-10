import { Component, OnInit,OnDestroy, Renderer2, Inject, ViewChild } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { of, throttleTime } from 'rxjs';
import { OrdersService } from '../Services/orders.service';
import { CustomerOrder } from '../Models/CustomerOrder';
import { CustomerService } from '../Services/customer.service';
import { valueOrDefault } from 'chart.js/dist/helpers/helpers.core';
import { DatePipe } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Route, Router } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { ViewCustomerOrderComponent } from '../view-customer-order/view-customer-order.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReviewComponent } from '../review/review.component';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

declare let paypal:any;  

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
customerOrders$:any = of([{}])
filterTerm:any
@ViewChild('form') subForm: any
order = new CustomerOrder()
customerOrderLine:any
customer:any
welcome:any
total:any
//paypal:any
result:any
data!:any
customerOrders:any
environment = environment
columnsSchema:any = [{key:'customerOrder_ID',name:'Customer Order ID'}, {key:'date',name:'Date'},{key:'orderStatus',name:'Order Status'},{key:'total',name:'Total'}, {key:'actions',name:''}]
displayedColumns: any[] = this.columnsSchema.map((x:any) => x.key);
  @ViewChild(MatPaginator) paginator!: MatPaginator
  dataSource:MatTableDataSource<any> = new MatTableDataSource<any>();
  idtodelete :any;
  //filterTerm!: string;
  selectedStatus:any = 4
  customers:any
  suppliers:any
  customersOrderLine:any
  supplierOrderLine:any
  products:any
  inventories:any
inProgressOrders:any
form:any
supplierOrders:any
role:any
permissions:any
formGroup!: FormGroup;
customerOrdersVm:any
statusResults:any = [
  {
    status_ID: 1,
    Name: 'In Progress'
  },
 
  {
    status_ID: 2,
    Name: 'Done'
  },
  {
    status_ID: 3,
    Name: 'Cancelled'
  },
  {
    status_ID: 4,
    Name: 'All'
  }
]
filteredCustomerOrders:any = of([{}])
//script: HTMLScriptElement = new HTMLScriptElement;
  constructor(private loginservice: LoginService,private orderservice: OrdersService, private customerService:CustomerService
    ,private _route:Router,private productService:ProductService,
    private matDialog: MatDialog){}
    //,private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    // this.form = new FormGroup({
    //   review : new FormControl("",[Validators.required, Validators.min(1)]),
    // })
    
    
    this.GetUserRole().then((res) => {
      
    })
    this.orderservice.orderVM.subscribe(()=>{
      this.GetCustomerOrders().then((res) => {
        this.GetCustomerOrdersLine().then((res) => {
          
          this.customerOrders$ = of(this.filteredCustomerOrders)
          //this.filteredCustomerOrders = of(this.filteredCustomerOrders)
          this.GetCustomer()
          this.ReadProducts()
          console.log(this.customerOrders$)
          console.log(this.filteredCustomerOrders)
          this.filteredCustomerOrders.subscribe((res:any)=>{
      console.log(res)
      this.customerOrdersVm = res
      this.customerOrdersVm.forEach((element:any) => {
        element.total = this.CalculateTotal(element.customerOrder_ID)
        element.orderStatus = this.ReturnType(element)
        element.date = this.ConvertDate(element.date_Created)

      })
      this.dataSource = new MatTableDataSource(this.customerOrdersVm)
      this.dataSource.paginator = this.paginator
      this.dataSource._updateChangeSubscription()
          })
          this.customerOrders$.subscribe((res:any)=>{
            console.log(res)
                })
        })
       
      })
    })
  
  
     // this.customerOrders = res
     
  
    
  }
  submit(form:any){
    console.log(form)
    let obj = {
      'merchant_id':'10000100',
      'merchant_key':'46f0cd694581a',
    }
   this.orderservice.PostPayFast(obj).subscribe((res:any)=>{
     res.status(200).send()
   })
   
  
    // this.httpClient.post("https://sandbox.payfast.co.za​/eng/process",form.value).subscribe((res:any)=>{
    //   console.log(res)
    // })

  }
  sub(e:any){
   e.target.submit()
  }
  async GetUserRole(){
    let value = new Promise((resolve, reject) => {
      this.loginservice.GetUserRole().subscribe((res) => {
        this.permissions = res.permissions
        console.log(res)
        console.log(this.permissions)
        resolve(res)
      }), (error: any) => {
        reject(error)
      }
    })
    await value
    return value
  }
  ReturnType(item:any){
    if(item.orderStatus_ID == 1){
      if(item.transaction_ID){
        return "Paid Online and pending"
      }else{
        return "Pending"
      }
    }else if(item.orderStatus_ID == 2){
      if(item.transaction_ID){
        return "Done and Paid Online"
      }else{
        return "Done instore"
      }
    }else if(item.orderStatus_ID == 3){
      if(item.transaction_ID){
        return "Cancelled and Refunded"
      }else{
        return "Cancelled"
      }
      
    }
    return
  }
  FilterOrders(){
    if(this.selectedStatus == 4){
      this.filteredCustomerOrders = of(this.customerOrders)
      this.dataSource = new MatTableDataSource(this.customerOrders)
      this.dataSource.paginator = this.paginator
      this.dataSource._updateChangeSubscription()
      return
    }
    this.filteredCustomerOrders = of(this.customerOrders.filter((item:CustomerOrder)=> (item.orderStatus_ID == this.selectedStatus)))
    console.log(this.filteredCustomerOrders)
    this.filteredCustomerOrders.subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator
      this.dataSource._updateChangeSubscription()
    })
    return
  }
  closeDialog(){

  }
  SubmitReview(item:any){
   const dialogRef = this.matDialog.open(ReviewComponent,{
      data:item,
      disableClose:true
    })
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){ 
       // this.ShowSnackBar("Review successfully submitted", "success");
        this.GetCustomerOrders()
      }else if(res == false){
        //this.ShowSnackBar("Review could not be submitted", "error");
      }
    })
  }
  ConvertDate(date:any){
    //return 
    //console.log(date)
    let inDate = new Date(date)
    let datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy/MM/dd');
    //return new Date(date)
     }
     ReviewBox(customerOrder_ID:any){
       
     }
  async GetCustomerOrders(){ // should be in progress orders... or can filter as well by finished orders...
    let value = new Promise((resolve, reject) => {
      this.loginservice.getCustomerOrders().subscribe((res) => {
        console.log(res)
        this.customerOrders = res
        this.filteredCustomerOrders = of(this.customerOrders) //of(this.customerOrders.filter((item:CustomerOrder)=> (item.orderStatus_ID == 1 && item.transaction_ID == null)))
        console.log(this.filteredCustomerOrders)
        console.log(this.filteredCustomerOrders)
        console.log(typeof(this.filteredCustomerOrders))
        console.log(typeof(this.customerOrders))
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
  Yoco(){
    let amount = 3;
    let token:any = localStorage.getItem('Token')
    localStorage.setItem('temp',token)
    localStorage.removeItem('Token')
    
    this.orderservice.PostYoco(amount).subscribe((res)=>{
      let token:any = localStorage.getItem('temp')
      console.log('current',token)
      localStorage.setItem('Token',token)
      
    }),(error:any)=>{
      localStorage.setItem('Token',token)
    }
  }
  PostPayFast(){
  let obj = {
    // <input type="hidden" name="merchant_id" value="10000100">
    // <input type="hidden" name="merchant_key" value="46f0cd694581a">
    // <!-- <input type="hidden" name="amount" value="100.00">
    // <input type="hidden" name="item_name" value="Test Product"> -->
    // <input type="hidden" name="signauture" value="jt7NOE43FZPn">
    'merchant_id':'10000100',
    'merchant_key':'46f0cd694581a',
    
    'signauture':'jt7NOE43FZPn'
    
  }
  // pass the order id as the item name as well
  // return url pass the successful parameter... or the order ID
  this.orderservice.PostPayFast(obj).subscribe((res)=>{
    
  })
  }
  Check(item:any){
    let total = this.CalculateTotal(item.customerOrder_ID)
    let orderVM = item
    orderVM.total = total
    this.orderservice.orderVM.next(orderVM)
    this.orderservice.checkout.next("checkout")
   this._route.navigate(['payment']); // see oif works if not maybe comment out a line or something...
    
  }
  async ViewOrder(item:any){
    await this.ReadOrders()
    let edit = false
    await this.ReadProducts()
    console.log(this.customersOrderLine)
    console.log(this.customerOrderLine)
    
    let customerOrderline:any = []
    
        this.customerOrderLine.forEach((orderLine:any) => {
         
          if(item.customerOrder_ID == orderLine.customerOrder_ID){
           customerOrderline.push(orderLine)
        }
      })
      console.log(customerOrderline)
      console.log(this.products)
      console.log(item)
      let name = this.customer.customer_FirstName + " " + this.customer.customer_Surname
      const dialogRef = this.matDialog.open(ViewCustomerOrderComponent, {
        data:{'orderLines':customerOrderline,'products':this.products,'customerOrder':item
      ,'name':name,'edit':edit}
      })
  }
  async ReadProducts(){
    let value = new Promise((resolve, reject) => {
      this.productService.getProductList().subscribe((success)=>{
        this.products = success
        resolve(success)
      }),(error:any)=>{
        reject(error)
      }
      
    })
    await value
    return value
  }
  async ReadOrders(){
    let val = new Promise((resolve:any)=>{ 
      this.orderservice.getOrders().subscribe((result:any) =>{
        
        this.customerOrders = []
        this.supplierOrders = []
        this.customers = []
        this.suppliers = []
        this.customersOrderLine = []
        this.supplierOrderLine = []
        this.products = []
        this.inventories = []
        if(result[0]){
          this.customerOrders = result[0]
          
        }if(result[1]){
          this.supplierOrders = result[1]
        }
        //this.data = this.supplierOrders
        if(result[2]){
          this.customers = result[2]
        }if(result[3]){
          this.suppliers = result[3]
        } if(result[4]){
          this.customersOrderLine = result[4]
        }  if(result[5]){
          this.supplierOrderLine = result[5]
        }if(result[6]){
          this.products = result[6]
        }if(result[7]){
          this.inventories = result[7]
        }
        resolve("true")
      },(err:any)=>{
        resolve("false")
      }
        
      
       
        )
  
    })
  }
  CalculateTotal(id:any){
    let total = 0

  this.customerOrderLine.forEach((element:any) => {
   //console.log(element)
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
