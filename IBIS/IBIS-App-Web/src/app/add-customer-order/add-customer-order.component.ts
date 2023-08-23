

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { InventoryService } from '../Services/inventory.service';
import { OrdersService } from '../Services/orders.service';
import { ChangeDetectorRef } from '@angular/core';
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
//@ViewChild(MatTable) myTable: MatTable<any>;
  CustomercolumnsSchema = [
    // {
    //     key: "Customer_Order_ID",
    //     type: "text",
    //     label: "Product ID"
    // },
    {
        key: "Product_ID",
        type: "Product_ID", // maybe just enter in... maybe select...
        label: "Product"
    },
    {
        key: "Quantity",
        type: "number",
        label: "Quantity"
    },
    {
     key:"Price",
     type:"number",
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
      key:"total",
      type: "total",
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
    Product_ID: '1',
    Name: 'Beef',
  },{
    Product_ID: '2',
    Name: 'Chicken',
  },
  {
    Product_ID: '3',
    Name: 'Cheese',
  },
  {
    Product_ID: '4',
    Name: 'Meat',
  }
]

dropDown:any= [{
  Product_ID: '1',
  Name: 'Beef',
},{
  Product_ID: '2',
  Name: 'Chicken',
},  {
  Product_ID: '3',
  Name: 'Cheese',
},
{
  Product_ID: '4',
  Name: 'Meat',
}
] // populate from API call not from products




  //formArr:FormArray<any> = new FormArray<any>([])
  constructor(public dialogRef: MatDialogRef<AddCustomerOrderComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder:FormBuilder,
  private productService:ProductService,private inventoryService:InventoryService,
  public orderService:OrdersService,public cdr:ChangeDetectorRef) {
    this.tableForm = this.formBuilder.group({
      arrayForm: this.formBuilder.array(this.results.map(r => this.formBuilder.group(r)))
    });
    
      this.columnsSchema = this.CustomercolumnsSchema
      this.displayedColumns = this.CustomercolumnsSchema.map((col) => col.key);
      console.log(this.dropDown)
      console.log(this.products)
      console.log(typeof(this.dropDown))
      // getSuppliers
      console.log(data)
      this.title = data.customer_FirstName + " "+ data.customer_Surname
      // this.productService.getProductList().subscribe((res:any)=>{
      //   //this.products = res
      // })
    }
   
   
    // this.displayedColumns.forEach((col) => {
    //   this.form.addControl(col, new FormControl('', Validators.required))
    // })
    
   ;
  
  
  disp(value:any){
    console.log(value)
  }

  addRow(){
    this.edited = true
    const control =  this.form.get('records') as FormArray; 
      
    control.push(this.initiateProductForm());

    this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
console.log((this.form.get('records') as FormArray).value)
console.log(this.dropDown)

  
    
  } 
      editRow(rowIndex:any){
        this.edited = true
        let val = (this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.setValue(false)
        const control =  this.form.get('records') as FormArray;
        console.log(control.value)
        this.rowIndexTemplate = rowIndex
        let Product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('Product_ID')?.value
        let productIndex = this.products.findIndex((item:any) => item.Product_ID == Product_ID)
        this.dropDown.push(this.products[productIndex])
       
       
       
      }

      initiateProductForm(): FormGroup {
        return this.formBuilder.group({
          Product_ID: new FormControl("", Validators.required),
          Product_Name: new FormControl(""),
        Quantity: new FormControl("", Validators.required),
        Price: new FormControl("",Validators.required),
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
          let Product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('Product_ID')?.value
          let productIndex = this.products.findIndex((item:any) => item.Product_ID == Product_ID)
         
          this.dropDown.push(this.products[productIndex])
        
        }
        const control =  this.form.get('records') as FormArray;

        control.removeAt(rowIndex);
        this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
        console.log(this.dataSource.data)
        console.log(control.value)
        this.dataSource._updateChangeSubscription()
        this.cdr.detectChanges()
        console.log(control.value)
        this.myTable.renderRows()
      }
      CalculateTotal(rowIndex:any){
        let formArr = this.form.get('records') as FormArray
        let quantity = formArr.controls[rowIndex].get('Quantity')?.value
        let price = formArr.controls[rowIndex].get('Price')?.value
        if(quantity && price){
          return quantity*price
        }
       return 
      }
     
  ngOnInit() {
    this.form = this.formBuilder.group({
      'records': this.formBuilder.array([])
    
      })
      
      }
    
    
    OnDone(rowIndex:any){
      this.edited = false
     console.log(rowIndex)
      let formArr = this.form.get('records') as FormArray
      console.log(formArr.value)
      let element = formArr.controls[rowIndex].value
      let Product_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('Product_ID')?.value
      let productIndex = this.products.findIndex((item:any) => item.Product_ID == Product_ID)
      // setting based on product index and not on product ID.
      formArr.controls[rowIndex].get("Product_Name")?.setValue(this.products[productIndex].Name)
      console.log(formArr.controls[rowIndex].get("Product_Name")?.value)
      let val = formArr.controls[rowIndex].get('isDone')?.setValue(true)
      
      let index = this.dropDown.findIndex((item:any) => item.Product_ID == element.Product_ID)
      this.dropDown.splice(index,1)
      console.log(this.dropDown)
      this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
     
     
     // let prodct_Name = this.products[index].Name
      //console.log(prodct_Name)
      this.dataSource._updateChangeSubscription()
    }
 
 

  }

