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

    
    this.data2 = [
      { productID: 1, Name: 'Product A', Quantity: 10, Price: 30 },
      { productID: 2, Name: 'Product B', Quantity: 15, Price: 50 },
      { productID: 3, Name: 'Product C', Quantity: 8, Price: 44 },
      { productID: 4, Name: 'Product D', Quantity: 20, Price: 25 },
      { productID: 5, Name: 'Product E', Quantity: 5, Price: 30 }
    ];

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
    this.combinedData = this.data2.map(item => ({ Name: item.Name || '', Quantity: item.Quantity || 0, Price: item.Price || 0 }));


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
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...this.data.map((p: { Product_ID: any; Product_Items: any; Quantity: any; }) => ([p.Product_ID, p.Product_Items, p.Quantity, (p.Product_Items*p.Quantity).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 3}, {}, {}, this.data.reduce((sum: number, p: { qty: number; price: number; })=> sum + (p.qty * p.price), 0).toFixed(2)]
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


