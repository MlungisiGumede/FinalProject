import { Component, OnInit } from '@angular/core';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/Product';
var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;


class Invoice{
  customerName= 'Johnny';
  address= '74 riding st';
  contactNo = 982734786;
  email= 'John@gmail';
  
  products: Product[] = [];
  additionalDetails!: string;
  
  
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {


  filterTerm!: string;
  
  combinedData: { Name: string, Quantity: number, Price: number }[] = [];
  constructor(private productService: ProductService, private route: ActivatedRoute) { }

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

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.combinedData = JSON.parse(params['combinedData'] || '[]');
      // const combinedData: { Name: string, Quantity: number }[] = JSON.parse(params['combinedData'] || '[]');
      const itemNames: string[] = this.combinedData.map(item => item.Name);
      const itemQuantities: number[] = this.combinedData.map(item => item.Quantity);
      const itemPrices: number[] = this.combinedData.map(item =>item.Price )
      console.log('yes we received the data from the product component', this.combinedData)
      
    });
  }




    invoice = new Invoice(); 
    
    
    generatePDF() {

      // this.productService.getProductList().subscribe(
      //   (response) => {
      //     const products: Product[] = response.data.products;
      //     this.invoice.products = products.map(product => ({
      //       name: product.Name || '',
      //       price: product.Price || 0,
      //       qty: product.Quantity || 0
      //     }));


      // this.invoice.products = this.combinedData.map(product => ({
      //   name: product.Name || '',
      //   price: product.Price || 0,
      //   quantity: product.Quantity || 0
      // }))

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
                ...this.invoice.products.map(p => ([p.Name, p.Price, p.Quantity, (p.Price!*p.Quantity!).toFixed(2)])),
                [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.Quantity! * p.Price!), 0).toFixed(2)]
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
