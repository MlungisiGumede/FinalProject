import { Component, OnInit } from '@angular/core';
import { Ng2SearchPipe } from 'ng2-search-filter';
var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product{
  name = 'hello';
  price= 500;
  qty= 7;
}
class Invoice{
  customerName= 'Johnny';
  address= '74 riding st';
  contactNo = 982734786;
  email= 'John@gmail';
  
  products: Product[] = [];
  additionalDetails!: string;

  constructor(){
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

 //jamie = new Product();
 
  filterTerm!: string;

  constructor() { }

  userRecords = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
    },
    {
      id: 6,
      name: 'Mrs. Dennis Schulist',
      username: 'Leopoldo_Corkery',
      email: 'Karley_Dach@jasper.info',
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
    },
  ];

  ngOnInit(): void {
  }




    invoice = new Invoice(); 
    
    generatePDF() {
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
                  text: this.invoice.customerName,
                  bold:true
                },
                { text: this.invoice.address },
                { text: this.invoice.email },
                { text: this.invoice.contactNo }
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
                ['Product', 'Price', 'Quantity', 'Amount'],
                ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
                [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
              ]
            }
          },
          {
            text: 'Additional Details',
            style: 'sectionHeader'
          },
          {
              text: this.invoice.additionalDetails,
              margin: [0, 0 ,0, 15]          
          },
          {
            columns: [
              [{ qr: `${this.invoice.customerName}`, fit: '50' }],
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
