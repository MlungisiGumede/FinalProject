import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
    private productservice: ProductService) {
      
    }
      // this.data = this.supplierOrders
    

  ngOnInit(): void {
    //this.getOrders()
  //  this.orderservice.getCustomerOrders().then(response => {
  //   console.log(response)
  //    this.customerOrders = response
  //  })
  //  this.orderservice.getSupplierOrders().then((response) => {
  //   console.log(response)
  //   this.supplierOrders = response
  // })
  let orders:any
  //this.supplierOrders = [...this.supplierOrders]
  //this.customerOrders = [...this.customerOrders]
  this.orderservice.getOrders().subscribe((result:any) =>{
    console.log(result[0])
    console.log(result[1])
    console.log(result[2])
    console.log(result[3])
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
   
  }
    
   
   
    )
 //this.customerOrders = orders[0]
  //this.supplierOrders = orders[1]
 // this.data = this.supplierOrders
  
 // this.data = [...this.data]
  }
  getCustomerName(id:any){
    let customer = this.customers.find((customer:any) => customer.customer_ID == id)
    return customer.customer_FirstName + " " + customer.customer_Surname
  }
  ToSupplier(){
    // edit records to standardize... then whatever is true is sent to API...
      console.log("supplier")
      if(this.isCustomerOrder){
        this.isCustomerOrder = false
      this.isCustomerOrder = false
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
   
   
  
  ToCustomer(){
 if(!this.isCustomerOrder){
console.log("customer")
    this.isCustomerOrder = true
    this.data = [...this.customerOrders]
    this.selectedStatus = 4
    
    this.title = "Customer Orders"
    //this.cdr.detectChanges()
 }
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
  this.cdr.detectChanges()
}


 


  async delete(element: any){
    
  if(this.customerOrders){
    
    this.orderservice.DeleteCustomerOrder(element.customerOrder_ID).subscribe((Response:any) => {
      console.log(Response);
  })
    
      //this.data = Response;
      //this.getOrders();
    }else{
      // let supplierOrder = this.supplierOrders[rowIndex]
      // this.orderservice.delete(supplierOrder.supplierOrder_ID).subscribe(Response => {
      //   console.log(Response)
      // });
    }
  }



  addOrder(){

    this.router.navigate(['/add-order']);

  }
  View(element:any){
    console.log(element)
    if(this.isCustomerOrder){
      this.productservice.getProductList().subscribe((res:any)=>{
        
        this.orderservice.getCustomerOrderLine(element).subscribe(response => {
      console.log(this.customerOrders)
      this.matDialog.open(ViewCustomerOrderComponent, {
        data:{'orderLines':response,'products':res,'customerOrder':element}
      })
        })
      })
      //let customerOrder = this.customerOrders[rowIndex]
      
    }else{
      //let supplierOrder = this.supplierOrders[rowIndex]
      this.matDialog.open(ViewSupplierOrderComponent, {
        data:element
      })
    }
   
   
  }
 
  Delete(){

  }
  UpdateOrderStatus(item:any,id:any){
    item.orderStatus_ID = id
    let array:any = []
this.orderservice.UpdateOrderStatus(item).subscribe(Response => {
  this.orderservice.getOrders().subscribe((result:any) =>{
    console.log(result[0])
    console.log(result[1])
    console.log(result[2])
    console.log(result[3])
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
