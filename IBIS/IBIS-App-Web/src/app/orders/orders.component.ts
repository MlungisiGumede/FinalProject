import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Orders } from '../Models/Orders';
import { Router } from '@angular/router';
import { OrdersService } from '../Services/orders.service';
import { SupplierService } from '../Services/supplier.service';
import { CustomerOrder } from '../Models/CustomerOrder';
import { SupplierOrder } from '../Models/SupplierOrder';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewSupplierOrderComponent } from '../view-supplier-order/view-supplier-order.component';
import { ViewCustomerOrderComponent } from '../view-customer-order/view-customer-order.component';
import { Observable, forkJoin, of } from 'rxjs';
import { ProductService } from '../Services/product.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, throwError } from 'rxjs';
import { OrdersHelpComponent } from '../orders-help/orders-help.component';
import { LoginService } from '../Services/login.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  data!:any
  ord: Orders[] = [];
  idtodelete :any;
  filterTerm!: string;
  selectedStatus:any = 4
  title:any = "Supplier Orders"
  customers:any
  suppliers:any
  customersOrderLine:any
  supplierOrderLine:any
  products:any
  inventories:any
  permissions:any
  role:any
  columnsSchema:any
  CustomercolumnsSchema:any = [{key:'customerOrder_ID',name:'Customer Order ID'}, {key:'customerName',name:'Customer Name'}, {key:'date',name:'Date'},{key:'orderStatus',name:'Order Status'},{key:'total',name:'Total'}, {key:'actions',name:''}]
  SuppliercolumnsSchema:any = [{key:'supplierOrder_ID',name:'Supplier Order ID'}, {key:'supplierName',name:'Supplier Name'}, {key:'date',name:'Date'},{key:'orderStatus',name:'Order Status'},{key:'total',name:'Total'}, {key:'actions',name:''}]
  displayedColumns: any[] =[]
  @ViewChild(MatPaginator) paginator!: MatPaginator
  dataSource:MatTableDataSource<any> = new MatTableDataSource<any>();
  customerOrdersVm:any
  supplierOrdersVm:any
  // supplierOrders:any
  // customerOrders:any
  isCustomerOrder:boolean=false
   customerOrders:CustomerOrder[]=[
    // {
    //   customerOrder_ID: '1',
    //   customer_ID: '1',
    //   date_Created: '1',
    //   orderStatus_ID: '1'
    // },
    // {
    //   customerOrder_ID: '3',
    //   customer_ID: '3',
    //   date_Created: '3',
    //   orderStatus_ID: '3'
    // },    {
    //   customerOrder_ID: '4',
    //   customer_ID: '4',
    //   date_Created: '4',
    //   orderStatus_ID: '4'
    // },    {
    //   customerOrder_ID: '2',
    //   customer_ID: '2',
    //   date_Created: '2',
    //   orderStatus_ID: '2'
    // }
   ];
   supplierOrders:SupplierOrder[]=[
    // {
    //   supplierOrder_ID: '1',
    //   supplier_ID: '1',
    //   Date_Created: '1',
    //   orderStatus_ID: '1'
    // },{
    //   supplierOrder_ID: '2',
    //   supplier_ID: '2',
    //   Date_Created: '2',
    //   orderStatus_ID: '2'
    // },
    // {
    //   supplierOrder_ID: '3',
    //   supplier_ID: '2',
    //   Date_Created: '2',
    //   orderStatus_ID: '3'
    // },{
    //   supplierOrder_ID: '4',
    //   supplier_ID: '2',
    //   Date_Created: '2',
    //   orderStatus_ID: '4'
    // }
  ]
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
    ] // read from the database or nah...
   ;
   

  constructor(public router: Router, private orderservice : OrdersService,
    private matDialog: MatDialog,public cdr:ChangeDetectorRef,
    private productservice: ProductService,private _snackbar: MatSnackBar,public helpModal: ModalController,
    private loginService:LoginService) {
      
    }
      // this.data = this.supplierOrders
    
      filter(event:any){
        this.dataSource.filterPredicate = function (record,filter) {
          return record.name.toLowerCase().includes(filter) || record.sku.toString().includes(filter) || record.supplierName.toLowerCase().includes(filter)
      }
      ;let filtervalue = event.target.value.trim().toLowerCase();
      this.dataSource.filter = filtervalue;
     }
  async ngOnInit(): Promise<void> {
   this.GetUserRole()
 await this.ReadOrders()
this.orderservice.addedOrder.subscribe((result:any)=>{
  this.ReadOrders()
})

  }
  async ReadProducts(){
let value = new Promise((resolve, reject) => {
  this.productservice.getProductList().subscribe((success)=>{
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
  let val = new Promise((resolve:any)=>{ this.orderservice.getOrders().subscribe((result:any) =>{
      console.log(result[0])
      console.log(result[1])
      console.log(result[2])
      console.log(result[3])
      this.customerOrders = []
      this.supplierOrders = []
      this.customers = []
      this.suppliers = []
      this.customersOrderLine = []
      this.supplierOrderLine = []
      this.products = []
      this.inventories = []
      if(result[4]){
        this.customersOrderLine = result[4]
      }  if(result[5]){
        this.supplierOrderLine = result[5]
      }if(result[6]){
        this.products = result[6]
      }if(result[7]){
        this.inventories = result[7]
      }
      if(result[2]){
        this.customers = result[2]
        
      } 
      if(result[0]){
        this.customerOrders = result[0]
        let customerOrderVm:any = this.customerOrders
        this.customerOrdersVm = customerOrderVm
        customerOrderVm.forEach((element:any) => {
          element.customerName = this.getCustomerName(element.customer_ID)
          element.total = this.CalculateTotal(element.customerOrder_ID)
          element.orderStatus = this.ReturnType(element)
          element.date = this.ConvertDate(element.date_Created)

        })
       
        
      }if(result[3]){
        this.suppliers = result[3]
      }if(result[1]){
        this.supplierOrders = result[1]
        let supplierOrderVm:any[] = this.supplierOrders
        this.supplierOrdersVm = supplierOrderVm
        console.log(supplierOrderVm)
        supplierOrderVm.forEach((element:any) => {
          element.supplierName = this.getSupplierName(element.supplier_ID)
          element.total = this.CalculateTotal(element.supplierOrder_ID)
          element.orderStatus = this.ReturnType(element)
          element.date = this.ConvertDate(element.date_Created)

        });
        console.log(supplierOrderVm)
        this.supplierOrders = result[1]
      }
      //this.data = this.supplierOrders
    
      this.CheckOrderStatus()
      resolve("true")
    },(err:any)=>{
      resolve("false")
    }
      
    
     
      )

  })
  await val
if(!this.isCustomerOrder){
      this.columnsSchema = this.SuppliercolumnsSchema
      this.displayedColumns = this.SuppliercolumnsSchema.map((x:any) => x.key);
        this.dataSource = new MatTableDataSource(this.supplierOrders)
        
        this.dataSource.paginator = this.paginator
}else{
  this.columnsSchema = this.CustomercolumnsSchema
  this.displayedColumns = this.CustomercolumnsSchema.map((x:any) => x.key);
  this.dataSource = new MatTableDataSource(this.customerOrders)
  this.dataSource.paginator = this.paginator
}
  return val
  }
  getCustomerName(id:any){
    let customer = this.customers.find((customer:any) => customer.customer_ID == id)
    if(customer){
      return customer.customer_FirstName + " " + customer.customer_Surname
    }else{
      return "Deleted"+ id
    }
    
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
  getSupplierName(id:any){
    console.log(id)
    console.log(this.suppliers)
    let supplier = this.suppliers.find((supplier:any) => supplier.supplier_ID == id)
    return supplier.name
  }
  GenerateReviews(){
    this.orderservice.GenerateReviewsReport().subscribe((res)=>{
      //alert("success")
    })
    // this.orderservice.ClassifyReviews().subscribe((res)=>{
    //   alert("success")
    // })
  }
  async GetUserRole(){
    let value = new Promise((resolve, reject) => {
      this.loginService.GetUserRole().subscribe((res) => {
        this.permissions = res.permissions
        this.role = res.role
        console.log(res)
       //alert(this.permissions)
        resolve(res)
      }), (error: any) => {
        reject(error)
      }
    })
    await value
    return value
  }
  CheckPermission(){
    if(this.role == "manager"){
        
      return true
     }
    if(this.isCustomerOrder){
      console.log(this.permissions)
        let index = this.permissions.findIndex((element:any) => element.permission_ID == 3)
        console.log(index)
      if(index > -1){
        return true
      }else{
       
        return false
      }
    }else if(this.permissions.permission_ID == 4){
      let index = this.permissions.findIndex((element:any) => element.permission_ID == 4)
      if(index > -1){

      return true
    }else{
      return false
    }
  }
  return
}
  ToSupplier(){
    // edit records to standardize... then whatever is true is sent to API...
      console.log("supplier")
      if(this.isCustomerOrder){
        this.isCustomerOrder = false
      this.isCustomerOrder = false
      this.columnsSchema = this.SuppliercolumnsSchema
    this.displayedColumns = this.SuppliercolumnsSchema.map((x:any) => x.key);
    console.log(this.customerOrdersVm)
    this.dataSource = new MatTableDataSource(this.supplierOrdersVm)
    this.dataSource.paginator = this.paginator
    this.dataSource._updateChangeSubscription();
      this.data = [...this.supplierOrders]
      this.selectedStatus = 4
      this.title = "Supplier Orders"
      }
     // wadadadadad
      //this.cdr.detectChanges()
    }
    ConvertDate(date:any){
   //return 
   console.log(date)
   let inDate = new Date(date)
   let datePipe = new DatePipe('en-US');
   return datePipe.transform(date, 'yyyy/MM/dd');
   //return new Date(date)
    }
   
   CalculateTotal(id:any){
    let total = 0
if(this.isCustomerOrder){
  this.customersOrderLine.forEach((element:any) => {
   
    if(element.customerOrder_ID == id){
      total = total + (element.quantity*element.price)
  }
})
}else{
  this.supplierOrderLine.forEach((element:any) => {
   
    if(element.supplierOrder_ID == id){
      total = total + (element.quantity*element.price)
  }
}) 
}
return total
   }
  
  ToCustomer(){
 if(!this.isCustomerOrder){
console.log("customer")
    this.isCustomerOrder = true
    this.data = [...this.customerOrders]
    this.selectedStatus = 4
    this.columnsSchema = this.CustomercolumnsSchema
    this.displayedColumns = this.CustomercolumnsSchema.map((x:any) => x.key);
    console.log(this.customerOrdersVm)
    this.customerOrdersVm.forEach((element:any) => {
      element.total = this.CalculateTotal(element.customerOrder_ID)
    })
    this.dataSource = new MatTableDataSource(this.customerOrdersVm)
    this.dataSource.paginator = this.paginator
    this.dataSource._updateChangeSubscription();
    this.title = "Customer Orders"
    //this.cdr.detectChanges()
 }
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: OrdersHelpComponent});
      return await modal.present();
  }
  

CheckOrderStatus(){
  console.log(this.selectedStatus)
  if((this.selectedStatus  == 1 || this.selectedStatus == 2 || this.selectedStatus == 3) && this.isCustomerOrder){
     this.data = []
     console.log("ts method hitting")
     this.isCustomerOrder = true
    this.customerOrders.forEach(element => {
      if(element.orderStatus_ID == this.selectedStatus){
        console.log(element)
      this.data.push(element)
    }
  })
  console.log(this.data)
  }else if((this.selectedStatus == 1 || this.selectedStatus == 2 || this.selectedStatus == 3) && !this.isCustomerOrder){
    this.data = []
    console.log("ts method htting")
    this.supplierOrders.forEach(element => {
      
      if(element.orderStatus_ID == this.selectedStatus){
        console.log(element)
        this.data.push(element)
      
    }
  })
}else if(this.isCustomerOrder){
    this.data = this.customerOrders
  }else{
     this.data = this.supplierOrders
  }
  
  this.data = [...this.data]
  console.log(this.data)
  this.dataSource = new MatTableDataSource(this.data)
  this.dataSource.paginator = this.paginator
  this.dataSource._updateChangeSubscription();
  if(this.data.length==0){}
  console.log(this.data)
  this.cdr.detectChanges()
}


 


  async delete(element: any){
    
  if(this.isCustomerOrder){
    
    this.orderservice.DeleteCustomerOrder(element.customerOrder_ID).pipe(map(
      (res)=>{






    }),
    catchError((err) =>{
      console.log(err)
      this.ShowSnackBar("Customer order could not be deleted", "error");
     
      return throwError(err)
    }))
.subscribe((Response:any) => {
      console.log(Response);
      this.ReadOrders()
      this.ShowSnackBar("Customer order successfully deleted", "success")
  })
    
      //this.data = Response;
      //this.getOrders();
    }else{
      this.orderservice.DeleteSupplierOrder(element.supplierOrder_ID).pipe(map(
        (res)=>{
  
  
  
  
  
  
      }),
      catchError((err) =>{
        console.log(err)
        this.ShowSnackBar("Supplier order could not be deleted", "error");
       
        return throwError(err)
      })).subscribe((Response:any) => {
        console.log(Response);
        this.ReadOrders()
        this.ShowSnackBar("Supplier order successfully deleted", "success")
      })
      // let supplierOrder = this.supplierOrders[rowIndex]
      // this.orderservice.delete(supplierOrder.supplierOrder_ID).subscribe(Response => {
      //   console.log(Response)
      // });
    }
  }



  addOrder(){

    this.router.navigate(['/add-order']);

  }
  async View(element:any){
    console.log(element)
    await this.ReadOrders()
    await this.ReadProducts()
    let edit = true
if(!this.CheckPermission()){
  edit = false
}
    if(element.orderStatus_ID == 2 || element.orderStatus_ID == 3 || element.transaction_ID != null || !this.permissions){
      edit = false
    }
    if(this.customersOrderLine && this.products){
    if(this.isCustomerOrder){
      if(this.isCustomerOrder){
        let customerOrderline:any = []
        this.customersOrderLine.forEach((orderLine:any) => {
         
          if(element.customerOrder_ID == orderLine.customerOrder_ID){
           customerOrderline.push(orderLine)
        }
      })
      let name = this.getCustomerName(element.customer_ID)
     const dialogRef = this.matDialog.open(ViewCustomerOrderComponent, {
        data:{'orderLines':customerOrderline,'products':this.products,'customerOrder':element
      ,'name':name,'edit':edit}
      
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result){

        this.ReadOrders()
        this.ShowSnackBar("Customer order successfuly edited", "success")
      }else if(result == false){
        this.ShowSnackBar("failed to edit customer order", "error")
        //alert("error")
      }
    })
  }
}else{
   let supplierOrderline:any = []
        this.supplierOrderLine.forEach((orderLine:any) => {
         
          if(element.supplierOrder_ID == orderLine.supplierOrder_ID){
           supplierOrderline.push(orderLine)
        }
      })
      let name = this.getSupplierName(element.supplier_ID)
     const dialogRef = this.matDialog.open(ViewSupplierOrderComponent, {
        data:{'orderLines':supplierOrderline,'inventories':this.inventories,'order':element
      ,'name':name}
      
    })    
    dialogRef.afterClosed().subscribe(result => {
      if(result){

        this.ReadOrders()
        this.ShowSnackBar("supplier order succcessfully edited", "success")
      }else if(result == false){
        this.ShowSnackBar("Failed to edit supplier order", "error")
        //alert("error")
      }
    })
  }
}
    
  }
  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "close", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }


  

    
      //let customerOrder = this.customerOrders[rowIndex]
      
    
   
   
  
 
  Delete(){

  }
  UpdateOrderStatus(item:any,id:any){
    let tempid = item.orderStatus_ID
    let tempDate = item.date_Created
    item.orderStatus_ID = id
    let array:any = []
    let date = this.ConvertDate(item.Date_Created)
    item.date_Created = date?.toString()
    if(this.isCustomerOrder){
this.orderservice.UpdateCustomerOrderStatus(item).pipe(map(
  (res)=>{






}),
catchError((err) =>{
  console.log(err)
if(err.status == 400){
  this.ShowSnackBar(err.error, "error");
 
  
}
return throwError(err)
    })).
subscribe(Response => {
this.ShowSnackBar("Customer order status successfully updated", "success")
  this.orderservice.getOrders().subscribe((result:any) =>{
 
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
    }
  })
  this.CheckOrderStatus()

  console.log(Response)
})
  }else    if(!this.isCustomerOrder){
    item.orderStatus_ID = id
    let date = this.ConvertDate(item.Date_Created)
    item.date_Created = date?.toString()
    this.orderservice.UpdateSupplierOrderStatus(item).subscribe(Response => {
    
      this.orderservice.getOrders().subscribe((result:any) =>{
     
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
        }
      })
      this.CheckOrderStatus()
    
      console.log(Response)
    })
      }
      item.orderStatus_ID = tempid
      item.date_Created = tempDate
    }






  generateInProgress() {
    let docDefinition = {
      content: [
        {
          text: 'Report',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'In-Progress Orders',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: 'this.invoice.customerName',
                bold:true
              },
              { text: 'this.invoice.address' },
              { text: 'this.invoice.email '},
              { text: 'this.invoice.contactNo' }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              { 
                text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'report Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            // body: [
            //   ['Inventory_ID', 'Inventory_Items', 'Quantity', 'Amount'],
            //   ...this.data[1].map((p: { order_ID: any; supplierName: any; quantity: any; }) => ([p.order_ID, p.supplierName, p.quantity, (p.quantity).toFixed(2)])),
            //   [{text: 'Total inventory', colSpan: 3}, {}, {}, this.data.reduce((sum: number, p: { quantity: number;  })=> sum + (p.quantity), 0).toFixed(2)]
            // ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: 'this.invoice.additionalDetails',
            margin: [0, 0 ,0, 15]          
        },
        {
          columns: [
            [{ qr: `${'this.invoice.customerName'}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Order can be return in max 10 days.',
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
              'This is system generated invoice.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]          
        }
      }
    };

   
      pdfMake.createPdf(docDefinition).download();
      //pdfMake.createPdf(docDefinition).print();      
   
      pdfMake.createPdf(docDefinition).open();      
   

  }


























}
