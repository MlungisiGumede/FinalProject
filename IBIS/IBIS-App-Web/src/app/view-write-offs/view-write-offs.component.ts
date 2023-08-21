import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WriteOffService } from '../Services/write-off.service';

var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-write-offs',
  templateUrl: './view-write-offs.component.html',
  styleUrls: ['./view-write-offs.component.css']
})
export class ViewWriteOffsComponent implements OnInit {

  data:any
  products: Product[] = [];
  idtodelete :any;
  filterTerm!: string;
  
  constructor(private writeOffService: WriteOffService,public router: Router) { 
    writeOffService = {} as WriteOffService;

  }

  ngOnInit() {
    this.getProducts()
  }

  async getProducts(){
    this.writeOffService.getWriteOffList().subscribe(response => {
      console.log(response);
      this.data = response;
    })
    

  }


  async delete(id: number){
    this.idtodelete = id;

this.writeOffService.delete(this.idtodelete).subscribe(Response => {
  console.log(Response);
  this.data = Response;
this.getProducts();
})
  }


  addWriteOff(){

    this.router.navigate(['/add-product']);

  }

  viewWriteoffs(){

    this.router.navigate(['/view-write-offs']);

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
          text: 'write off report',
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
                text: '',
                bold:true
              },
              { text: '' },
              { text: ' '},
              { text: '' }
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
              ['write off ID', 'item Name', 'quantity', 'reason'],
              ...this.data.map((p: { write_Off_Id: any; item_name: any; quantity_Written_Off: any; reason: any}) => ([p.write_Off_Id, p.item_name, p.quantity_Written_Off, p.reason])),
              
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


