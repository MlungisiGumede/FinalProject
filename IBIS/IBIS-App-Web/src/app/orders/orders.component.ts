import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Orders } from '../Models/Orders';
import { Router } from '@angular/router';
import { OrdersService } from '../Services/orders.service';
import { SupplierService } from '../Services/supplier.service';
var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  data:any
  ord: Orders[] = [];
  idtodelete :any;
  filterTerm!: string;

  constructor(public router: Router, private orderservice : OrdersService) { }

  ngOnInit(): void {
    this.getOrders()
  }

  getOrders(){
    this.orderservice.getOrderList().subscribe(response => {
      console.log(response);
      this.data = response;
    })
    

  }


  async delete(id: number){
    this.idtodelete = id;

    this.orderservice.delete(this.idtodelete).subscribe(Response => {
      console.log(Response);
      this.data = Response;
      this.getOrders();
    })
  }



  addOrder(){

    this.router.navigate(['/add-order']);

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
            body: [
              ['Inventory_ID', 'Inventory_Items', 'Quantity', 'Amount'],
              ...this.data[1].map((p: { order_ID: any; supplierName: any; quantity: any; }) => ([p.order_ID, p.supplierName, p.quantity, (p.quantity).toFixed(2)])),
              [{text: 'Total inventory', colSpan: 3}, {}, {}, this.data.reduce((sum: number, p: { quantity: number;  })=> sum + (p.quantity), 0).toFixed(2)]
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
      //pdfMake.createPdf(docDefinition).print();      
   
      pdfMake.createPdf(docDefinition).open();      
   

  }


























}
