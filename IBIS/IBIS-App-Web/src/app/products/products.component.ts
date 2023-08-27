import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { ChartDataset, ChartType, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare var myChart: any;


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  data:any
  data2: Product[] = [];
  products: Product[] = [];
  idtodelete :any;
  search= "";
  productItems: any;
  itemNames: any;
  itemQuantities: any;
  filterTerm!: string;

  combinedData: { Name: string, Quantity: number , Price: number}[] = [];

  constructor(private productService: ProductService,public router: Router,private toastController: ToastController) { 
    productService = {} as ProductService;
  }

  ngOnInit() {
    this.getProducts()

    
    // this.data2 = [
    //   { product_ID: 1, product_Name: 'Product A', quantity: 10, price: 30 },
    //   { product_ID: 2, product_Name: 'Product B', quantity: 15, price: 50 },
    //   { product_ID: 3, product_Name: 'Product C', quantity: 8, price: 44 },
    //   { product_ID: 4, product_Name: 'Product D', quantity: 20, price: 25 },
    //   { product_ID: 5, product_Name: 'Product E', quantity: 5, price: 30 }
    // ];

  }

  getProducts(){
    this.productService.getProductList().subscribe(response => {
      console.log(response);
      this.data = response;
    })
  }

  async delete(id: number){
    this.idtodelete = id;

    this.productService.delete(this.idtodelete).subscribe(Response => {
      console.log(Response);
      this.data = Response;
      this.presentToast('top')
      this.getProducts();
    })
  }


  addproduct(){
    this.router.navigate(['/add-product']);
  }

  viewWriteoffs(){
    this.router.navigate(['/view-write-offs']);
  }


  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Product successfully removed',
      duration: 5000,
      position: position,
      color: 'success'
    });

    await toast.present();
  }

  generateReport(){
    this.productService.getProductList().subscribe(
      (res) => {
        this.productItems = res;
        this.itemNames = this.productItems.data.products.map((products: any) => products.Name); 
        this.itemQuantities = this.productItems.data.products.map((products: any) => products.Quantity);
        console.log(this.itemNames);
        console.log(this.itemQuantities);


        // for(const item in productItems){
        //   itemNames.push(item.Name || '')
        //   itemQuantities.push(item.Quantity || 0)
        // }
        
        this.router.navigate(['/Product-Report'],{
          queryParams: {
            itemNames: JSON.stringify(this.itemNames),
            itemQuantities: JSON.stringify(this.itemQuantities)
          }                         //pass data to product-report page using queryParams//
        });
      },
      (error)=>{
        console.error('Error fetching product data:', error);
      }
    );
  }

  generateReport2() {
    // Process dummy data and navigate to the report component
    //this.combinedData = this.data2.map(item => ({ name: item.product_Name|| '', Quantity: item.quantity || 0, Price: item.price|| 0 }));


    this.router.navigate(['/product-report'], {
      queryParams: {
        combinedData: JSON.stringify(this.combinedData)
      }
    });
  }  
 
  generPDF() {
    let docDefinition = {
      content: [
        {
          text: 'Products Report',
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
                text: 'products',
                bold:true
              },
              { text: 'New Report' },
              { text: 'Information '},
              { text: 'See information below' }
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
              ...this.data.map((p: { product_Name: any; price: any; quantity: any; }) => ([p.product_Name, p.price, p.quantity, (p.price*p.quantity).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 3}, {}, {}, this.data.reduce((sum: number, p: { quantity: number; price: number; })=> sum + (p.quantity * p.price), 0).toFixed(2)],
              [{text: 'Total Quantity:', colSpan: 3}, {}, {}, this.data.reduce((sum: number, p: { quantity: number; })=> sum + (p.quantity), 0).toFixed(2)]
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

  // generateReport3(){
  //   this.combinedData = this.data2.map(item => ({ Name: item.Name || '', Quantity: item.Quantity || 0 , Price: item.Price || 0}));
  //   this.router.navigate(['Reports'], {
  //     queryParams: {
  //       combinedData: JSON.stringify(this.combinedData)
  //     }
  //   });

  //}

}


