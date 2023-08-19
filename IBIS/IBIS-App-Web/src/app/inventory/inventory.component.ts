import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../Services/inventory.service';
import { Inventory } from '../Models/Inventory';
import { ToastController } from '@ionic/angular';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ng2SearchPipe } from 'ng2-search-filter/src/ng2-filter.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  data:any
  invent: Inventory[] = [];
  idtodelete :any;
  filterTerm!: string;
  viewinventoryform!: FormGroup;
  inventory: any;

  constructor(public router: Router, private inv : InventoryService,private toastController: ToastController,private fb : FormBuilder) {
    //this.inventory = new Inventory();
   }


  

  ngOnInit() {

 

    



    this.getInventory()
  }

  getInventory(){
    this.inv.getInventoryList().subscribe(response => {
      console.log(response);
      this.data = response;
      //let inventory = JSON.stringify(response["inventory_ID"]);
     // console.log('this is:',JSON.stringify(response['inventory_ID']))
    // console.log('finally',response);
     
    })
    

  }


  async delete(id: number){
    this.idtodelete = id;

this.inv.delete(this.idtodelete).subscribe(Response => {
  console.log(Response);
  this.data = Response;
this.getInventory();
})
this.presentToast('top')
  }



  addInventoryItem(){

    this.router.navigate(['/add-inventory-item']);

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

  generatePDF() {  
    let docDefinition = {  
      content: [  
        {  
          text: 'Products Report',  
          fontSize: 16,  
          alignment: 'center',  
          color: '#047886'  
        },  
        {  
          text: '2023',  
          fontSize: 20,  
          bold: true,  
          alignment: 'center',  
          decoration: 'underline',  
          color: 'skyblue'  
        },
      ]

    };  
   
    pdfMake.createPdf(docDefinition).open();  
  }  







  genPDF() {

    


    this.inv.getInventoryList().subscribe(response => {
      console.log(response);
      this.data = response;
      //this.inventory = response.Inventory_ID
    })





    let docDefinition = {
      content: [
        {
          text: 'Inventory Report',
          fontSize: 16,
          alignment: 'center',
          color: '#FFD700'
        },
        {
          text: 'IN-Stock',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Inventory',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.inventory,
                bold:true
              },
              { text: ''},
              { text: this.inventory},
              { text: this.inventory}
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
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
         
            table: {
              headerRows: 1,
              width: ['*', 'auto', 'auto', 'auto'],
              body: [
                [{text:'Service: '}],
                [{text:'Dealership: ', bold: true,}],
                [{text:'Team: ', bold: true,}],
                [{text:'Service Type: ', bold: true,}],
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
            [{ qr: '`${this.invoice.customerName}`', fit: '50' }],
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

  








  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'you have successfully removed an inventory item',
      duration: 3000,
      position: position,
      color: 'success'
    });

    await toast.present();
  }

}
