import { Component, OnInit, ViewChild } from '@angular/core';
import { Supplier } from '../Models/Supplier';
import { SupplierService } from '../Services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';
import { AddSupplierOrderComponent } from '../add-supplier-order/add-supplier-order.component';
import { InventoryService } from '../Services/inventory.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { ViewSupplierComponent } from '../view-supplier/view-supplier.component';
import { SupplierHelpComponent } from '../supplier-help/supplier-help.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  data:Observable<any> = new Observable();
  Suppliers : Supplier[]=[];
  bool= false;
  idtodelete :any;
  id: any;
  filterTerm!: string;
  columnsSchema:any = [ {key:'name',name:'SupplierName'}, {key:'address',name:'Address'},{key:'email',name:'Email'},{key:'phone',name:'Phone'}, {key:'actions',name:''}]
  displayedColumns: string[] = this.columnsSchema.map((x:any) => x.key);
  @ViewChild(MatPaginator) paginator!: MatPaginator
  dataSource:MatTableDataSource<any> = new MatTableDataSource<any>();

  constructor(private supply: SupplierService,public router: Router,private route: ActivatedRoute,private logged: LoginService,private toastController: ToastController
    ,private matDialog: MatDialog,public inventoryService: InventoryService,
    private _snackbar: MatSnackBar,public helpModal: ModalController) {
      
    

    supply = {} as SupplierService;
  }

  ngOnInit() {

  this.getall();

  }
SupplierOrder(item:any){
  this.inventoryService.getInventoriesPerSupplier(item).subscribe((res:any)=>{
    const dialog = this.matDialog.open(AddSupplierOrderComponent, {
      data:{'inventories':res,'name':item.name,'order':item}
    })
    dialog.afterClosed().subscribe(result => {
      if(result){
        this.ShowSnackBar("Supplier Order successfully added", "success");
        this.getall();
      }else if(result == false){
        this.ShowSnackBar("Supplier Order could not be added", "error");
      }
    })
  })

}
View(item:any){
const dialogRef = this.matDialog.open(ViewSupplierComponent, {
  data:item
})
dialogRef.afterClosed().subscribe(result => {
  if(result){
   this.ShowSnackBar("Supplier successfully updated", "success");
    this.getall();
  }else if(result == false){
    this.ShowSnackBar("Supplier could not be updated", "error");
  }
}), (error:any) => {
  
}
}



  getall(){

    this.supply.getSupplierList().subscribe(response => {
      console.log(response);
      this.data = of(response);
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator
    })

  }
  filter(event:any){
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: SupplierHelpComponent});
      return await modal.present();
  }

  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "close", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }



  AddSupplier(){
  
const dialogRef = this.matDialog.open(AddSupplierComponent);
     dialogRef.afterClosed().subscribe(result => {
       if(result){
        this.ShowSnackBar("Supplier successfully added", "success");
         this.getall();
       }else if(result == false){
         this.ShowSnackBar("Supplier could not be added", "error");
       }
     }), (error:any) => {
       
     }
  
    }

    async delete(id: number){
      this.idtodelete = id;
  
  this.supply.delete(this.idtodelete).pipe(map(
    (res)=>{


  }),
  catchError((err) =>{
    if(err.status == 400){
      this.ShowSnackBar(err.error, "error");
    }else{
      this.ShowSnackBar("failed to remove supplier", "error");
    }
    console.log(err)
   
    return throwError(err)
  })).subscribe(Response => {
    
   this.ShowSnackBar("Supplier successfully deleted", "success");
  this.getall();
  }), (error:any) => {
    
    this.ShowSnackBar("failed to delete supplier", "error");
  }
    }



  logout(){
    this.logged.setlogin(true)

    this.logged.getlogin().subscribe((value) => {
      this.bool = value;
      console.log("you are no longer logged in",this.bool)
    });

    this.router.navigate(['/Login']);
  }


  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
    message: 'Supplier successfully removed',
    duration: 5000,
    position: position,
    color: 'success'
  });

  await toast.present();
  }



  generPDF() {
    let docDefinition = {
      content: [
        {
          text: 'Reports',
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
            //   ['Supplier', 'Supplier Name', 'Address', 'Phone'],
            //   ...this.data.map((p: { supplier_ID: any; companyName: any; addressline: any; phone: any}) => ([p.supplier_ID, p.companyName, p.addressline, p.phone])),
              
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
      pdfMake.createPdf(docDefinition).print();      
   
      pdfMake.createPdf(docDefinition).open();      
   

  }


}


