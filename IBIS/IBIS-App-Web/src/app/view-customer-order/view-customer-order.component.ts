

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { InventoryService } from '../Services/inventory.service';
import { OrdersService } from '../Services/orders.service';
import { ChangeDetectorRef } from '@angular/core';
import { CustomerOrderLine } from '../Models/CustomerOrderLine';
import { CustomerOrder } from '../Models/CustomerOrder';
import { CustomerOrderViewModel } from '../Models/CustomerOrderViewModel';
//import { SupplierOrder } from '../Models/SupplierOrder';
//import { CustomerOrder } from '../Models/CustomerOrder';

@Component({
  selector: 'app-view-customer-order',
  templateUrl: './view-customer-order.component.html',
  styleUrls: ['./view-customer-order.component.css']
})
export class ViewCustomerOrderComponent implements OnInit {




  @ViewChild("orderTable") myTable: any
  dataSource:MatTableDataSource<any> = new MatTableDataSource();
  array:any = []
  form!:FormGroup
  tableForm:FormGroup
  submitArray:any
  title:any
  response:any = []
  arrived = false
  quantityGreater = false
  //supplierOrder:SupplierOrder = new SupplierOrder
  //customerOrder:CustomerOrder = new CustomerOrder
  edited = false
  rowIndexTemplate:any
  globalArray:any
  selectedValue:any
  customerOrder:any
  filteredDropDown:any
  customerOrderLine = [{
    Customer_Order_ID: '1',
    product_ID: '1',
    quantity: '1',
    price: '10'
  },{
  Customer_Order_ID: '2',
  product_ID: '2',
  quantity: '2',
  price: '20'
}
  ]
//@ViewChild(MatTable) myTable: MatTable<any>;
  CustomercolumnsSchema = [
    // {
    //     key: "Customer_Order_ID",
    //     type: "text",
    //     label: "Product ID"
    // },
    {
        key: "product_ID",
        type: "product_ID", // maybe just enter in... maybe select...
        label: "Product"
    },
    {
        key: "quantity",
        type: "number",
        label: "Quantity"
    },
    {
     key:"price",
     type:"price",
     label:"Price per unit (kg)"

    },
    {
      key:"total",
      type:"total",
      label:"Total"
    },
    {
        key: "isDone",
        type: "isDone",
        label: ""
    },
    {
      key: "isDelete",
      type: "isDelete",
      label: ""
  }

  ]
  SuppliercolumnsSchema = [
    // {
    //     key: "Id",
    //     type: "text",
    //     label: "Inventory ID"
    // },
    {
        key: "Inventory_ID",
        type: "Inventory_ID",
        label: "Inventory Item"
    },
    {
        key: "Quantity",
        type: "number",
        label: "Quantity"
    },   
    {key:"Price",
     type:"number",
     label:"Price per unit (kg)"

    },

    {
        key: "isDone",
        type: "isDone",
        label: ""
    },
    {
      key: "isDelete",
      type: "isDelete",
      label: ""
  },   {
    key:"total",
    type: "total",
    label:"Total"
  }

  ]

 displayedColumns: string[] = []
 // dataSource: any;
 orderDef:any
  columnsSchema:any

  orders:any = []
  customerColumns = [] // columns schema then map...
  supplierColumns = []
  results = [
    { id: 1, title: 'title 1' },
    { id: 2, title: 'title 2' },
  ]
  
  products:any = [{
    product_ID: '1',
    name: 'Beef',
  },{
    product_ID: '2',
    name: 'Chicken',
  },
  {
    product_ID: '3',
    name: 'Cheese',
  },
  {
    product_ID: '4',
    name: 'Meat',
  }
]

dropDown:any= [{
  product_ID: '1',
  name: 'Beef',
},{
  product_ID: '2',
  name: 'Chicken',
},  {
  product_ID: '3',
  name: 'Cheese',
},
{
  product_ID: '4',
  name: 'Meat',
}
] // populate from API call not from products




  //formArr:FormArray<any> = new FormArray<any>([])
  constructor(public dialogRef: MatDialogRef<ViewCustomerOrderComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder:FormBuilder,
  private productService:ProductService,private inventoryService:InventoryService,
  public orderService:OrdersService,public cdr:ChangeDetectorRef) {
    this.tableForm = this.formBuilder.group({
      arrayForm: this.formBuilder.array(this.results.map(r => this.formBuilder.group(r)))
    });
    
      this.columnsSchema = this.CustomercolumnsSchema
      this.displayedColumns = this.CustomercolumnsSchema.map((col) => col.key);
     this.customerOrder = data
      // getSuppliers
     
    this.title = data.name
      
     }
     onKey(value:any) {
      this.filteredDropDown = this.search(value);
      }
      ConsoleLog(element:any,key:any){
        //console.log(element)
        //console.log(key)
      }

     
     // **// Filter the states list and send back to populate the selectedStates**
      search(value: string) {
        let filter = value.toLowerCase();
        return this.dropDown.filter((option:any) => option.name.toLowerCase().startsWith(filter));
      }
    
    
   
   
    // this.displayedColumns.forEach((col) => {
    //   this.form.addControl(col, new FormControl('', Validators.required))
    // })
    
   ;
  
  
  disp(value:any){
   
  }

  addRow(){
    this.edited = true
    const control =  this.form.get('records') as FormArray; 
    
    control.push(this.initiateEmptyProductForm());

    this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);


  
    
  } 
      editRow(rowIndex:any){
        this.edited = true
        let val = (this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.setValue(false)
        const control =  this.form.get('records') as FormArray;
        this.quantityGreater = control.controls[rowIndex].get('quantityGreater')?.value
        this.rowIndexTemplate = rowIndex
        this.filteredDropDown = [...this.dropDown]
        let product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('product_ID')?.value
        let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
        this.dropDown.push(this.products[productIndex])
        this.filteredDropDown.push(this.products[productIndex])
       
       
       
      }
      SetPrice(event:any,rowIndex:any){
        console.log(event)
        let product_ID = event.value
        let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
        //this.CheckQuantity(this.selectedQuantity,product_ID)
        let val = (this.form.get('records') as FormArray).controls[rowIndex].get('price')?.setValue(this.products[productIndex].price)
        let val2 = (this.form.get('records') as FormArray).controls[rowIndex].get('quantity')?.setValue(null)
        this.quantityGreater = false
        this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
        this.dataSource._updateChangeSubscription()
      }
  

      initiateProductForm(element:CustomerOrderLine,product_Name:any,quantityGreater:boolean): FormGroup {
        console.log(element)
        return this.formBuilder.group({
          product_ID: new FormControl(element.product_ID, Validators.required),
          name: new FormControl(product_Name),
        quantity: new FormControl(element.quantity, Validators.required),
        quantityGreater: new FormControl(quantityGreater),
        price: new FormControl(element.price,Validators.required),
        isDone: new FormControl(true),
        isDelete: new FormControl("")
        });
      }

      initiateEmptyProductForm(): FormGroup {
        return this.formBuilder.group({
          product_ID: new FormControl("", Validators.required),
          name: new FormControl(""),
      quantity: new FormControl("", Validators.required),
      quantityGreater: new FormControl(false),
        price: new FormControl("",Validators.required),
        isDone: new FormControl(false),
        isDelete: new FormControl("")
        });
      }
   
      DeleteRow(rowIndex: number) {
        //.edited = false
       
        if(this.dataSource.data.length==0){
          this.edited = false
        }
        if((this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.value == false){
          this.edited = false
        }else{
          let product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('product_ID')?.value
          let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
         
          this.dropDown.push(this.products[productIndex])
        
        }
        const control =  this.form.get('records') as FormArray;

        control.removeAt(rowIndex);
        this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
       
        this.dataSource._updateChangeSubscription()
        this.cdr.detectChanges()
       
        this.myTable.renderRows()
      }
      CalculateTotal(rowIndex:any){
        let formArr = this.form.get('records') as FormArray
        let quantity = formArr.controls[rowIndex].get('quantity')?.value
        let price = formArr.controls[rowIndex].get('price')?.value
        if(quantity && price){
          return quantity*price
        }
       return 
      }
      CalculateSubTotal(){
       
        let total = 0
        let formArr = this.form.get('records') as FormArray
       for(let i = 0; i < formArr.length; i++){
         let quantity = formArr.controls[i].get('quantity')?.value
         let price = formArr.controls[i].get('price')?.value
         if(quantity && price){
           total += quantity*price
         }
       }
       return total
      }
     
  ngOnInit() {
    this.form = this.formBuilder.group({
      'records': this.formBuilder.array([])
    
      })
       this.dropDown = [...this.data.products]
       this.filteredDropDown = [...this.data.products]
       this.products = [...this.data.products]
      let control =  this.form.get('records') as FormArray
             this.data.orderLines.forEach((element:any) => {
            let productIndex = this.products.findIndex((item:any) => item.product_ID == element.product_ID)
            let product_Name = this.products[productIndex].name
            console.log(element)
            console.log(control.value)
            if(element.quantity > this.products[productIndex].quantity){
              control.push(this.initiateProductForm(element,product_Name,true))
            }else{
              control.push(this.initiateProductForm(element,product_Name,false))
              
            }
            console.log((this.form.get('records') as FormArray).value)
          });
       let val = (this.form.get('records') as FormArray).value.forEach((element:any) => {
            
            let index = this.dropDown.findIndex((item:any) => item.product_ID == element.product_ID)
            console.log(index)
            console.log(this.dropDown[index])
            this.filteredDropDown.splice(index,1)
          this.dropDown.splice(index,1)
          console.log(this.dropDown)
          })
          console.log(control.value)
          this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
           console.log(this.dataSource.data)
           this,
         // let prodct_Name = this.products[index].Name
          //console.log(prodct_Name)
          this.dataSource._updateChangeSubscription()
          //control.push(this.initiateProductForm(element,product_Name))
        }
        FindPrice(product_ID:any){
          let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
          return this.products[productIndex].price
       }
       CheckQuantity(value:any,product_ID:any){
        console.log(value)
        console.log(product_ID)
        let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
         console.log(this.products[productIndex].quantity)
        if(value>this.products[productIndex].quantity){
          this.quantityGreater = true
          this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value); // see if without these lines...
          this.dataSource._updateChangeSubscription()
        }else{
          this.quantityGreater = false
        }
          }
    
 
        
    
  
  Edit(){
    let customerOrderViewModel:CustomerOrderViewModel = new CustomerOrderViewModel()
      let customerOrder:CustomerOrder = new CustomerOrder()
      customerOrder.customerOrder_ID = this.data.customerOrder.customerOrder_ID
      customerOrder.customer_ID = this.data.customerOrder.customer_ID
      customerOrder.orderStatus_ID = this.data.customerOrder.orderStatus_ID
      customerOrder.date_Created = Date.now().toString()
      customerOrderViewModel.customerOrder = customerOrder
      let orderLines = (this.form.get('records') as FormArray).value
      orderLines.forEach((element:CustomerOrderLine) => {
        element.customerOrder_ID = this.data.customerOrder.customerOrder_ID
        console.log(element.customerOrder_ID)
      });
      customerOrderViewModel.customerOrderLines = orderLines
      this.orderService.UpdateCustomerOrder(customerOrderViewModel).subscribe(() => {
        this.dialogRef.close("success")
      }), (error:any) => {
        this.dialogRef.close("error")
      }
      
  }
    
  
      

     
     
     
     // let prodct_Name = this.products[index].Name
      //console.log(prodct_Name)
      
    
      
      
    
    
    OnDone(rowIndex:any){
      this.edited = false
     
      let formArr = this.form.get('records') as FormArray
      
      let element = formArr.controls[rowIndex].value
      let product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('product_ID')?.value
      let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
      // setting based on product index and not on product ID.
      formArr.controls[rowIndex].get("name")?.setValue(this.products[productIndex].name)
      if(this.quantityGreater == true){
        formArr.controls[rowIndex].get("quantityGreater")?.setValue(true)
      }else{
        formArr.controls[rowIndex].get("quantityGreater")?.setValue(false)
      }

      this.quantityGreater = false
      let val = formArr.controls[rowIndex].get('isDone')?.setValue(true)
      this.filteredDropDown = [...this.dropDown]
      let index = this.dropDown.findIndex((item:any) => item.product_ID == element.product_ID)
      this.dropDown.splice(index,1)
      this.filteredDropDown.splice(index,1)
     
      this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
     
     
     // let prodct_Name = this.products[index].Name
     
      this.dataSource._updateChangeSubscription()
    }
 
 

  }




