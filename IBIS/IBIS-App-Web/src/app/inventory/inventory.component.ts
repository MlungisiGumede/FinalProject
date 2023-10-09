import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../Services/inventory.service';
import { Inventory } from '../Models/Inventory';
import { ModalController, ToastController } from '@ionic/angular';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ng2SearchPipe } from 'ng2-search-filter/src/ng2-filter.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddInventoryItemComponent } from '../add-inventory-item/add-inventory-item.component';
import { SupplierService } from '../Services/supplier.service';
import { Supplier } from '../Models/Supplier';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { ViewInventoryItemComponent } from '../view-inventory-item/view-inventory-item.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryHelpComponent } from '../inventory-help/inventory-help.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
//import pdfMake from "pdfmake/build/pdfmake";
//import * as pdfMake from 'pdfmake/build/pdfmake';
//import * as pdfFonts from "pdfmake/build/vfs_fonts";  
//pdfMake.vfs = pdfFonts.pdfMake.vfs; 
//(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  data:Observable<any> = new Observable();
  invent: Inventory[] = [];
  idtodelete :any;
  filterTerm!: string;
  viewinventoryform!: FormGroup;
  inventory: any;
  inID: any;
  suppliers:Supplier[] = []
  reportData:any
  columnsSchema:any = [{key:'sku',name:'SKU'}, {key:'name',name:'Name'}, {key:'supplier_ID',name:'Supplier Name'}, {key:'actions',name:''}]
  displayedColumns: string[] = this.columnsSchema.map((x:any) => x.key);
  @ViewChild(MatPaginator) paginator!: MatPaginator
  dataSource:MatTableDataSource<any> = new MatTableDataSource<any>();
  constructor(public router: Router, private inv : InventoryService,private toastController: ToastController,private fb : FormBuilder
    ,public matDialog: MatDialog,public supplierService:SupplierService,public helpModal: ModalController,
    private _snackbar: MatSnackBar) {
    //this.inventory = new Inventory();

   }
   async showHelp(){
    const modal = await this.helpModal.create({
      component: InventoryHelpComponent});
      return await modal.present();
  }


  ViewInventory(item:any){
    if(this.suppliers){
      const dialogRef = this.matDialog.open(ViewInventoryItemComponent, {
        data:{'suppliers':this.suppliers,'item':item}
      })
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.ShowSnackBar('Inventory successfully updated','success')
          this.getInventory();
        }else if(result==false){
          this.ShowSnackBar('Inventory could not be updated','error')
        }
      }), (error:any) => {
        this.ShowSnackBar('Inventory could not be updated','error')
      }
    }
    
   
  }
  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "close", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }

  ngOnInit() {
this.dataSource.filterPredicate = function (record,filter) {
  return record.name.toLowerCase().includes(filter) || record.sku.toString().includes(filter) || record.supplierName.toLowerCase().includes(filter)
}
 

    this.supplierService.getSupplierList().subscribe(response => {
      console.log(response);
      this.suppliers = response
    })



    this.getInventory()
  }

  getInventory(){
    this.inv.getInventoryList().subscribe(response => {
      console.log(response);
      if(response){
        this.data = of(response)
        this.inventory = response
        this.inventory.forEach((element:any) => {
          element.supplierName = this.GetSupplierName(element.supplier_ID)
        })
        this.dataSource = new MatTableDataSource(this.inventory)
         this.dataSource.paginator = this.paginator
        this.dataSource._updateChangeSubscription()
          this.reportData = response
      }
   
     
    })
    

  }
  GetSupplierName(id:any){
return this.suppliers.find(supplier => supplier.supplier_ID == id)?.name
  }


  async delete(id: number){
    this.idtodelete = id;

this.inv.delete(this.idtodelete).pipe(map(
  (res)=>{


}),
catchError((err) =>{
  if(err.status == 400){
    this.ShowSnackBar(err.error, "error");
  }else{
    this.ShowSnackBar("failed to remove inventory", "error");
  }
  console.log(err)
  
  return throwError(err)
})).
subscribe(Response => {
 this.ShowSnackBar("Inventory successfully deleted", "success");
this.getInventory();
}), (error:any) => {
  this.ShowSnackBar("failed to delete inventory", "error");
}

  }
  filter(event:any){
    this.dataSource.filterPredicate = function (record,filter) {
      return record.name.toLowerCase().includes(filter) || record.sku.toString().includes(filter) || record.supplierName.toLowerCase().includes(filter)
  }
  ;let filtervalue = event.target.value.trim().toLowerCase();
  this.dataSource.filter = filtervalue;
 }



  addInventoryItem(){

    //this.router.navigate(['/add-inventory-item']);
    
      const dialogRef = this.matDialog.open(AddInventoryItemComponent,{
        data:this.suppliers
      })
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.ShowSnackBar('Inventory successfully added','success')
          this.getInventory();
        }else if(result==false){
          this.ShowSnackBar('Inventory could not be added','error')
        }
      }), (error:any) => {
        this.ShowSnackBar('Inventory could not be added','error')
      }
    }

  

  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }

 
   

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'you have successfully removed an inventory item',
      duration: 3000,
      position: position,
      color: 'success'
    });

    await toast.present();
  }


















FormBody(data:any, columns:any) { // https://stackoverflow.com/questions/26658535/building-table-dynamically-with-pdfmake
  var body = [];
  
  let displayedColumns = ['inventory ID','SKU','Name','Supplier Name']
console.log(data)
console.log(columns)
    body.push(displayedColumns);
    //this.reportData.map()

     data.forEach((row:any) => {
       let dataRow:any = [];

        columns.forEach( (column:any) => {
          console.log(column)
          console.log(row)
          console.log(row[column])
      if(column == "supplier_ID"){
        row[column] = this.GetSupplierName(row[column])
         }
         dataRow.push(row[column])
        })
      body.push(dataRow);
     } 
     )

       
    // 
    
    console.log(body)
    console.log(body)
    return body;
}





  generPDF() {
   
    
          let docDefinition = {
            content: [
              {
                text: 'Inventory Report',
                fontSize: 16,
                alignment: 'center',
                color: '#047886'
              },
              {
                text: 'New Report',
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
                text: 'Report Details',
                style: 'sectionHeader'
              },
              {
                table: {
                  headerRows: 1,
                   widths: ['*', 'auto', 'auto', 'auto'],
                  body: this.FormBody(this.reportData, ['inventory_ID','sku','name','supplier_ID'])
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
            pdfMake.createPdf(docDefinition).print();      
         
            pdfMake.createPdf(docDefinition).open();      
         
      
        }

   
        
   

  }























