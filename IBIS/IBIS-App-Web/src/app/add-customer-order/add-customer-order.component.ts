

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { InventoryService } from '../Services/inventory.service';
import { OrdersService } from '../Services/orders.service';
import { ChangeDetectorRef } from '@angular/core';
import { CustomerOrderViewModel } from '../Models/CustomerOrderViewModel';
import { CustomerOrderLine } from '../Models/CustomerOrderLine';
import { CustomerOrder } from '../Models/CustomerOrder';
import { DatePipe } from '@angular/common';
import { catchError, map, throwError } from 'rxjs';

//import { SupplierOrder } from '../Models/SupplierOrder';
//import { CustomerOrder } from '../Models/CustomerOrder';

@Component({
  selector: 'app-add-customer-order',
  templateUrl: './add-customer-order.component.html',
  styleUrls: ['./add-customer-order.component.css']
})
export class AddCustomerOrderComponent implements OnInit {




  @ViewChild("orderTable") myTable: any
  dataSource:MatTableDataSource<any> = new MatTableDataSource();
  array:any = []
  form!:FormGroup
  tableForm:FormGroup
  submitArray:any
  title:any
  //supplierOrder:SupplierOrder = new SupplierOrder
  //customerOrder:CustomerOrder = new CustomerOrder
  edited = false
  rowIndexTemplate:any
  globalArray:any
  selectedValue:any
  //selectedQuantity:any
  quantityGreater = false
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
    {key:"price",
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
  products:any
  dropDown:any
 filteredDropDown:any
  orders:any = []
  customerColumns = [] // columns schema then map...
  supplierColumns = []
  results = [
    { id: 1, title: 'title 1' },
    { id: 2, title: 'title 2' },
  ]
  

  constructor(public dialogRef: MatDialogRef<AddCustomerOrderComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder:FormBuilder,
  private productService:ProductService,private inventoryService:InventoryService,
  public orderService:OrdersService,public cdr:ChangeDetectorRef) {
    this.tableForm = this.formBuilder.group({
      arrayForm: this.formBuilder.array(this.results.map(r => this.formBuilder.group(r)))
    });
    
      this.columnsSchema = this.CustomercolumnsSchema
      this.displayedColumns = this.CustomercolumnsSchema.map((col) => col.key);
    
      // getSuppliers
      
      this.title = data.customer_FirstName + " "+ data.customer_Surname
      // this.productService.getProductList().subscribe((res:any)=>{
      //   this.products = res
      // })
    }
    onKey(value:any) { 
      this.filteredDropDown = this.search(value);
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
    this.rowIndexTemplate = control.length
    control.push(this.initiateProductForm());

    this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);


  
    
  } 
      editRow(rowIndex:any){
        this.edited = true
        let val = (this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.setValue(false)
        const control =  this.form.get('records') as FormArray;
        let quantityGreater = control.controls[rowIndex].get('quantityGreater')?.value
        if(quantityGreater == true){
          this.quantityGreater = true
        }
        this.rowIndexTemplate = rowIndex
        let product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('product_ID')?.value
        let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
        this.dropDown.push(this.products[productIndex])
         this.filteredDropDown.push(this.products[productIndex])
       
       
      }
      FindPrice(product_ID:any){
         let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
         return this.products[productIndex].price
      }
      CheckPrice(rowIndex:any){
        return (this.form.get('records') as FormArray).controls[rowIndex].get('price')?.value
      }

      initiateProductForm(): FormGroup {
        return this.formBuilder.group({
          product_ID: new FormControl("", Validators.required),
          name: new FormControl(""),
        quantity: new FormControl("",[Validators.required,Validators.min(1)] ),
        quantityGreater: new FormControl(false),
        price: new FormControl("",[Validators.required,Validators.min(1)]),
        isDone: new FormControl(false),
        isDelete: new FormControl("")
        });
      }
   
      DeleteRow(rowIndex: number) {
        //.edited = false
       console.log(rowIndex)
        if(this.dataSource.data.length==0){
          this.edited = false
        }
        if((this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.value == false){
          this.edited = false
        }else{
          let product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('product_ID')?.value
          let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
         
          this.dropDown.push(this.products[productIndex])
          this.filteredDropDown.push(this.products[productIndex])
        
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
        if(quantity && price && quantity*price>0){
          return quantity*price
        }
       return 
      }
      CalculateSubTotal(){
        //console.log("sub total")
        let total = 0
        let formArr = this.form.get('records') as FormArray
       for(let i = 0; i < formArr.length; i++){
         let quantity = formArr.controls[i].get('quantity')?.value
         let price = formArr.controls[i].get('price')?.value
         if(quantity && price){
           total += quantity*price
         }
       }
       if(total>0){
         return total
       }
       return 
      }
      ConsoleLog(element:any,key:any){
        //console.log(element)
        //console.log(key)
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
     
  ngOnInit() {
    this.form = this.formBuilder.group({
      'records': this.formBuilder.array([])
    
      })
      
      this.productService.getProductList().subscribe((res:any)=>{
        let products = res
        let dropDown = res
        this.dropDown = [...dropDown]
        this.products = [...products]
        this.filteredDropDown = [...this.dropDown]
        //console.log(this.products)
        console.log(this.dropDown)
      console.log(this.products)
      })
      
    
      
      }
    
    
    OnDone(rowIndex:any){
      this.edited = false
     
      let formArr = this.form.get('records') as FormArray
      
      let element = formArr.controls[rowIndex].value
      let product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('product_ID')?.value
      let productIndex = this.products.findIndex((item:any) => item.product_ID == product_ID)
      // setting based on product index and not on product ID.
      formArr.controls[rowIndex].get("name")?.setValue(this.products[productIndex].name)
      console.log(this.quantityGreater)
      if(this.quantityGreater == true){
        formArr.controls[rowIndex].get("quantityGreater")?.setValue(true)
      }else{
        formArr.controls[rowIndex].get("quantityGreater")?.setValue(false)
      }
      console.log(formArr.controls[rowIndex].get("quantityGreater")?.value)
       this.quantityGreater = false
      let val = formArr.controls[rowIndex].get('isDone')?.setValue(true)
      this.filteredDropDown = [...this.dropDown]
      let index = this.dropDown.findIndex((item:any) => item.product_ID == element.product_ID)
      this.dropDown.splice(index,1)
      this.filteredDropDown.splice(index,1)
     
      this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
     console.log(this.dropDown)
     console.log(this.filteredDropDown)
     console.log(this.products)
     
     // let prodct_Name = this.products[index].Name
     
      this.dataSource._updateChangeSubscription()
    }
    Submit(){
      let customerOrderViewModel:CustomerOrderViewModel = new CustomerOrderViewModel()
      let customerOrder:CustomerOrder = new CustomerOrder()
      customerOrder.customer_ID = this.data.customer_ID
      let date = new Date(Date.now())
      customerOrder.date_Created = date.toString()
      customerOrderViewModel.customerOrder = customerOrder
      let orderLines = (this.form.get('records') as FormArray).value
      
      customerOrderViewModel.customerOrderLines = orderLines
  this.orderService.CreateCustomerOrder(customerOrderViewModel).pipe(map(
    (res)=>{






  }),
  catchError((err) =>{
    console.log(err)
    this.dialogRef.close(false);
   
    return throwError(err)
  })).
subscribe((res:any)=>{
   //let total = this.CalculateSubTotal()
   this.orderService.addedOrder.next(res)
   this.dialogRef.close("success")
  }),(error:any) => {
    this.dialogRef.close("error")
  }
    
      
      console.log(customerOrderViewModel)

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
 
 

  }

