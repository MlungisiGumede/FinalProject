import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from '../Services/inventory.service';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';
import { SupplierOrderLine } from '../Models/SupplierOrderLine';
import { SupplierOrderViewModel } from '../Models/SupplierOrderViewModel';
import { SupplierOrder } from '../Models/SupplierOrder';
import { OrdersService } from '../Services/orders.service';

@Component({
  selector: 'app-view-supplier-order',
  templateUrl: './view-supplier-order.component.html',
  styleUrls: ['./view-supplier-order.component.css']
})
export class ViewSupplierOrderComponent implements OnInit {



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
  supplierOrder:any
//@ViewChild(MatTable) myTable: MatTable<any>;
  // CustomercolumnsSchema = [
  //   // {
  //   //     key: "Customer_Order_ID",
  //   //     type: "text",
  //   //     label: "Product ID"
  //   // },
  //   {
  //       key: "Product_ID",
  //       type: "Product_ID", // maybe just enter in... maybe select...
  //       label: "Product"
  //   },
  //   {
  //       key: "Quantity",
  //       type: "number",
  //       label: "Quantity"
  //   },
  //   {
  //    key:"Price",
  //    type:"number",
  //    label:"Price per unit (kg)"

  //   },
  //   {
  //     key:"total",
  //     type:"total",
  //     label:"Total"
  //   },
  //   {
  //       key: "isDone",
  //       type: "isDone",
  //       label: ""
  //   },
  //   {
  //     key: "isDelete",
  //     type: "isDelete",
  //     label: ""
  // }

  //]
  SuppliercolumnsSchema = [
    // {
    //     key: "Id",
    //     type: "text",
    //     label: "Inventory ID"
    // },
    {
        key: "inventory_ID",
        type: "inventory_ID",
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
  supplierOrderLines:SupplierOrderLine[] = []
  // {
  //     supplierOrderLine_ID: '1',
  //     supplier_Order_ID: '1',
  //     inventory_ID: '1',
  //     quantity: '1',
  //     price: '10'
  //   }, {
  //     supplierOrderLine_ID: '2',
  //     supplier_Order_ID: '2',
  //     inventory_ID: '2',
  //     quantity: '2',
  //     price: '10'
  //   }
  // ]
 
  orders:any = []
  customerColumns = [] // columns schema then map...
  supplierColumns = []
  results = [
    { id: 1, title: 'title 1' },
    { id: 2, title: 'title 2' },
  ]
  
  inventories:any = [{
    inventory_ID: '1',
    Name: 'Beef',
  },{
    inventory_ID: '2',
    Name: 'Chicken',
  },
  {
    inventory_ID: '3',
    Name: 'Cheese',
  },
  {
    inventory_ID: '4',
    Name: 'Meat',
  }
]

dropDown:any= [{
  inventory_ID: '1',
  Name: 'Beef',
},{
  inventory_ID: '2',
  Name: 'Chicken',
},  {
  inventory_ID: '3',
  Name: 'Cheese',
},
{
  inventory_ID: '4',
  Name: 'Meat',
}
] // populate from API call not from products




  //formArr:FormArray<any> = new FormArray<any>([])
  constructor(public dialogRef: MatDialogRef<ViewSupplierOrderComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder:FormBuilder,
  private inventoryService:InventoryService,
  public cdr:ChangeDetectorRef,private orderService:OrdersService) {
    this.tableForm = this.formBuilder.group({
      arrayForm: this.formBuilder.array(this.results.map(r => this.formBuilder.group(r)))
    });
    
      this.columnsSchema = this.SuppliercolumnsSchema
      this.displayedColumns = this.SuppliercolumnsSchema.map((col) => col.key);
      this.supplierOrder = data
      // getSuppliers
     
    this.title = data.name
     
    }
   
   
    
    
   ;
  
  
  disp(value:any){
    console.log(value)
  }

  addRow(){
    this.edited = true
    const control =  this.form.get('records') as FormArray; 
      
    control.push(this.initiateEmptyInventoryForm());

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
        let inventory_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('inventory_ID')?.value
        let inventoryIndex = this.inventories.findIndex((item:any) => item.inventory_ID == inventory_ID)
        this.dropDown.push(this.inventories[inventoryIndex])
       
       
       
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
      initiateInventoryForm(element:SupplierOrderLine,inventory_Name:any): FormGroup {
        return this.formBuilder.group({
            inventory_ID:new FormControl(element.inventory_ID, Validators.required),
            name: new FormControl(inventory_Name, ),
            Quantity: new FormControl(element.quantity, Validators.required),
            Price: new FormControl(element.price,Validators.required),
            isDone: new FormControl(true),   // closest form group id then set it in form...
            isDelete: new FormControl("")
          
        });
        
      }
      initiateEmptyInventoryForm(): FormGroup {
        return this.formBuilder.group({
            inventory_ID:new FormControl("", Validators.required),
            name: new FormControl("", ),
            Quantity: new FormControl("", Validators.required),
            Price: new FormControl("",Validators.required),
            isDone: new FormControl(false),   // closest form group id then set it in form...
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
          let inventory_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('inventory_ID')?.value
          console.log(inventory_ID)
          let inventoryIndex = this.inventories.findIndex((item:any) => item.inventory_ID == inventory_ID)
         console.log(inventoryIndex)
         console.log(this.inventories)
        this.dropDown.push(this.inventories[inventoryIndex])
        console.log(this.dropDown)
        }
        const control =  this.form.get('records') as FormArray;

        control.removeAt(rowIndex);
        this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
        console.log(this.dataSource.data)
        console.log(control.value)
        this.dataSource._updateChangeSubscription()
        //this.cdr.detectChanges()
        console.log(control.value)
       // this.myTable.renderRows()
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
          this.dropDown = [...this.data.inventories]
         this.inventories = [...this.data.inventories]
      console.log(this.supplierOrderLines)
      const control =  this.form.get('records') as FormArray; 
      this.data.orderLines.forEach((element:any) => {
        let inventoryIndex = this.inventories.findIndex((item:any) => item.inventory_ID == element.inventory_ID)
        console.log(inventoryIndex)
        let inventory_Name = this.inventories[inventoryIndex].name
        console.log(inventory_Name)
        console.log(element)
        control.push(this.initiateInventoryForm(element,inventory_Name));
    
     
        let val = (this.form.get('records') as FormArray).value.forEach((element:any) => {
             
             let index = this.dropDown.findIndex((item:any) => item.inventory_ID == element.inventory_ID)
             console.log(index)
             console.log(this.dropDown[index])
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
       
      
       
       
      });
      (this.form.get('records') as FormArray).controls.forEach((element:any) => {
        console.log(element.value)
        let value = element.value
        let index = this.dropDown.findIndex((item:any) => item.inventory_ID == value.inventory_ID)
        console.log(index)
        console.log(this.dropDown[index])
      this.dropDown.splice(index,1)
      console.log(this.dropDown)
      })
      this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
       console.log(this.dataSource.data)
       
     // let prodct_Name = this.products[index].Name
      //console.log(prodct_Name)
      this.dataSource._updateChangeSubscription()
      
      }
      CalculateSubTotal(){
        
        let total = 0
        let formArr = this.form.get('records') as FormArray
       for(let i = 0; i < formArr.length; i++){
         let quantity = formArr.controls[i].get('Quantity')?.value
         let price = formArr.controls[i].get('Price')?.value
         if(quantity && price){
           total += quantity*price
         }
       }
       return total
      }
    
    
    OnDone(rowIndex:any){
      this.edited = false
     console.log(rowIndex)
      let formArr = this.form.get('records') as FormArray
      console.log(formArr.value)
      let element = formArr.controls[rowIndex].value
      let inventory_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('inventory_ID')?.value
      let inventoryIndex= this.inventories.findIndex((item:any) => item.inventory_ID == inventory_ID)
      // setting based on product index and not on product ID.
      formArr.controls[rowIndex].get("name")?.setValue(this.inventories[inventoryIndex].name)
      console.log(formArr.controls[rowIndex].get("name")?.value)
      let val = formArr.controls[rowIndex].get('isDone')?.setValue(true)
      
      let index = this.dropDown.findIndex((item:any) => item.inventory_ID == element.inventory_ID)
      this.dropDown.splice(index,1)
      console.log(this.dropDown)
      this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
     
     
     // let prodct_Name = this.products[index].Name
      //console.log(prodct_Name)
      this.dataSource._updateChangeSubscription()
    }

    Edit(){
      let supplierOrderViewModel:SupplierOrderViewModel = new SupplierOrderViewModel()
        let supplierOrder:SupplierOrder = new SupplierOrder()
        supplierOrder.supplierOrder_ID = this.data.order.supplierOrder_ID
        supplierOrder.supplier_ID = this.data.order.supplier_ID
        supplierOrder.orderStatus_ID = this.data.order.orderStatus_ID
        supplierOrder.date_Created = this.data.order.date_Created
        supplierOrderViewModel.supplierOrder = supplierOrder
        let orderLines = (this.form.get('records') as FormArray).value
        orderLines.forEach((element:SupplierOrderLine) => {
          element.supplierOrder_ID = this.data.order.supplierOrder_ID
         
        });
        supplierOrderViewModel.supplierOrderLines = orderLines
        this.orderService.UpdateSupplierOrder(supplierOrderViewModel).subscribe(() => {
          this.dialogRef.close("success")
        }), (error:any) => {
          this.dialogRef.close("error")
        }
        
    }
 
 

  

}



