import { Component, OnInit } from '@angular/core';
import { Supplier } from '../Models/Supplier';
import { SupplierService } from '../Services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';
import { AddSupplierOrderComponent } from '../add-supplier-order/add-supplier-order.component';
import { InventoryService } from '../Services/inventory.service';

var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  data: any;
  Suppliers : Supplier[]=[];
  bool= false;
  idtodelete :any;
  id: any;
  filterTerm!: string;
  

  constructor(private supply: SupplierService,public router: Router,private route: ActivatedRoute,private logged: LoginService,private toastController: ToastController
    ,private matDialog: MatDialog,public inventoryService: InventoryService) {
      
    

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
  })

}



  getall(){

    this.supply.getSupplierList().subscribe(response => {
      console.log(response);
      this.data = response;
    })

  }



  AddSupplier(){
  
const dialog = this.matDialog.open(AddSupplierComponent);
     
  
    }

    async delete(id: number){
      this.idtodelete = id;
  
  this.supply.delete(this.idtodelete).subscribe(Response => {
    console.log(Response);
    this.data = Response;
    this.presentToast('top')
  this.getall();
  })
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
            body: [
              ['Supplier', 'Supplier Name', 'Address', 'Phone'],
              ...this.data.map((p: { supplier_ID: any; companyName: any; addressline: any; phone: any}) => ([p.supplier_ID, p.companyName, p.addressline, p.phone])),
              
            ]
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


