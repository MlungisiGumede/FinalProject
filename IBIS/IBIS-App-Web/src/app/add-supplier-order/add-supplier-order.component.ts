import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from '../Services/inventory.service';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';

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
  private inventoryService:InventoryService,
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
        let Inventory_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('Inventory_ID')?.value
        let inventoryIndex = this.inventories.findIndex((item:any) => item.Inventory_ID == Inventory_ID)
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
      initiateInventoryForm(): FormGroup {
        return this.formBuilder.group({
            Inventory_ID:new FormControl("", Validators.required),
            Name: new FormControl("", ),
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
          let Inventory_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('Inventory_ID')?.value
          let inventoryIndex = this.inventories.findIndex((item:any) => item.Inventory_ID == Inventory_ID)
         
          this.dropDown.push(this.inventories[inventoryIndex])
        
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
      CalculateSubTotal(){
        console.log("sub total")
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
      let Inventory_ID =(this.form.get('records') as FormArray).controls[rowIndex].get('Inventory_ID')?.value
      let inventoryIndex= this.inventories.findIndex((item:any) => item.Inventory_ID == Inventory_ID)
      // setting based on product index and not on product ID.
      formArr.controls[rowIndex].get("Name")?.setValue(this.inventories[inventoryIndex].Name)
      console.log(formArr.controls[rowIndex].get("Name")?.value)
      let val = formArr.controls[rowIndex].get('isDone')?.setValue(true)
      
      let index = this.dropDown.findIndex((item:any) => item.Inventory_ID == element.Inventory_ID)
      this.dropDown.splice(index,1)
      console.log(this.dropDown)
      this.dataSource = new MatTableDataSource((this.form.get('records') as FormArray).value);
     
     
     // let prodct_Name = this.products[index].Name
      //console.log(prodct_Name)
      this.dataSource._updateChangeSubscription()
    }
 
 

  

}
