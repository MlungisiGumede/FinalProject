import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from '../Services/inventory.service';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';
import { SupplierOrderViewModel } from '../Models/SupplierOrderViewModel';
import { SupplierOrder } from '../Models/SupplierOrder';
import { OrdersService } from '../Services/orders.service';

@Component({
  selector: 'app-add-supplier-order',
  templateUrl: './add-supplier-order.component.html',
  styleUrls: ['./add-supplier-order.component.css']
})
export class AddSupplierOrderComponent implements OnInit {



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
  filteredDropDown:any
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
        key: "quantity",
        type: "number",
        label: "Quantity"
    },   
    {key:"price",
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
  
  inventories:any = [{
    Inventory_ID: '1',
    Name: 'Beef',
  },{
    Inventory_ID: '2',
    Name: 'Chicken',
  },
  {
    Inventory_ID: '3',
    Name: 'Cheese',
  },
  {
    Inventory_ID: '4',
    Name: 'Meat',
  }
]

dropDown:any= [{
  Inventory_ID: '1',
  Name: 'Beef',
},{
  Inventory_ID: '2',
  Name: 'Chicken',
},  {
  Inventory_ID: '3',
  Name: 'Cheese',
},
{
  Inventory_ID: '4',
  Name: 'Meat',
}
] // populate from API call not from products




  //formArr:FormArray<any> = new FormArray<any>([])
  constructor(public dialogRef: MatDialogRef<AddSupplierComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder:FormBuilder,
  private inventoryService:InventoryService,private orderService:OrdersService,
  public cdr:ChangeDetectorRef) {
    this.tableForm = this.formBuilder.group({
      arrayForm: this.formBuilder.array(this.results.map(r => this.formBuilder.group(r)))
    });
    
      this.columnsSchema = this.SuppliercolumnsSchema
      this.displayedColumns = this.SuppliercolumnsSchema.map((col) => col.key);
      console.log(this.dropDown)
      console.log(this.inventories)
      console.log(typeof(this.dropDown))
      // getSuppliers
      console.log(data)
      this.title = data.name
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
  onKey(value:any) {
    this.filteredDropDown = this.search(value);
    }
    search(value: string) {
      let filter = value.toLowerCase();
      return this.dropDown.filter((option:any) => option.name.toLowerCase().startsWith(filter));
    }


  addRow(){
    this.edited = true
    const control =  this.form.get('records') as FormArray; 
      
    control.push(this.initiateInventoryForm());

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
        this.filteredDropDown.push(this.inventories[inventoryIndex])
       
       
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
      initiateInventoryForm(): FormGroup {
        return this.formBuilder.group({
            inventory_ID:new FormControl("", Validators.required),
            name: new FormControl("", ),
            quantity: new FormControl("", [Validators.required,Validators.min(1)]),
            price: new FormControl("",[Validators.required,Validators.min(1)]),
            isDone: new FormControl(false),   // closest form group id then set it in form...
            isDelete: new FormControl("")
          
        });
      }

      Submit(){
        let supplierOrderViewModel:SupplierOrderViewModel = new SupplierOrderViewModel()
        let supplierOrder:SupplierOrder = new SupplierOrder()
        supplierOrder.supplier_ID = this.data.order.supplier_ID
        let date = new Date(Date.now())
        supplierOrder.date_Created = date.toString()
        supplierOrderViewModel.supplierOrder = supplierOrder
        let orderLines = (this.form.get('records') as FormArray).value
        
        supplierOrderViewModel.supplierOrderLines = orderLines
    this.orderService.CreateSupplierOrder(supplierOrderViewModel).subscribe((res:any)=>{
     //let total = this.CalculateSubTotal()
     this.orderService.addedOrder.next(res)
     this.dialogRef.close("success")
    }),(error:any) => {
      this.dialogRef.close("error")
    }
      
        
        
  
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
          let inventoryIndex = this.inventories.findIndex((item:any) => item.inventory_ID == inventory_ID)
         
          this.dropDown.push(this.inventories[inventoryIndex])
          this.filteredDropDown.push(this.inventories[inventoryIndex])

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
        let quantity = formArr.controls[rowIndex].get('quantity')?.value
        let price = formArr.controls[rowIndex].get('price')?.value
        if(quantity && price){
          return quantity*price
        }
       return 
      }
     
  ngOnInit() {
    this.form = this.formBuilder.group({
      'records': this.formBuilder.array([])
    
      }) // BY ID...
      // check if data passes through else not iterable maybe... but doesnt matter?..?
        let inventories = this.data.inventories
        //let dropDown = this.data.inventories
        this.dropDown = [...this.data.inventories]
        this.filteredDropDown = [...this.data.inventories]
        this.inventories = [...inventories]
       // own method then await
  
       
      
      }
      CalculateSubTotal(){
        console.log("sub total")
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
      this.filteredDropDown = [...this.dropDown]
      let index = this.dropDown.findIndex((item:any) => item.inventory_ID == element.inventory_ID)
      this.dropDown.splice(index,1)
      console.log(this.dropDown)
      this.filteredDropDown.splice(index,1)
      this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
     
     
     // let prodct_Name = this.products[index].Name
      //console.log(prodct_Name)
      this.dataSource._updateChangeSubscription()
    }
 
 

  

}
