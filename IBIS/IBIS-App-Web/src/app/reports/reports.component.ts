import { Component, OnInit } from '@angular/core';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/Product';
import { InventoryService } from '../Services/inventory.service';
import { SupplierService } from '../Services/supplier.service';
import { OrdersService } from '../Services/orders.service';
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
  dataInventory:any
  dataProduct:any
  dataSupplier:any
  dataOrder:any
  dataWriteOff:any
  filterTerm!: string;
  
  combinedData: { Name: string, Quantity: number, Price: number }[] = [];
  constructor(private productService: ProductService, private route: ActivatedRoute,
     private inv : InventoryService,private supply: SupplierService,private orderservice : OrdersService) { }

  ngOnInit() {


    this.getInventory();
    this.getProducts();
    this.getSuppliers();
    this.getOrders();


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
    
    
    generatePDF() {}

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

      





      getProducts(){
        this.productService.getProductList().subscribe(response => {
          console.log(response);
          this.dataProduct = response;
        })
      }

generateProductReport(){
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
            ...this.dataProduct.map((p: { product_Name: any; price: any; quantity: any; }) => ([p.product_Name, p.price, p.quantity, (p.price*p.quantity).toFixed(2)])),
            [{text: 'Total Amount', colSpan: 3}, {}, {}, this.dataProduct.reduce((sum: number, p: { quantity: number; price: number; })=> sum + (p.quantity * p.price), 0).toFixed(2)],
            [{text: 'Total Quantity:', colSpan: 3}, {}, {}, this.dataProduct.reduce((sum: number, p: { quantity: number; })=> sum + (p.quantity), 0).toFixed(2)]
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


getSuppliers(){

  this.supply.getSupplierList().subscribe(response => {
    console.log(response);
    this.dataSupplier = response;
  })

}
generateSupplierReport(){
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
            ...this.dataSupplier.map((p: { supplier_ID: any; companyName: any; addressline: any; phone: any}) => ([p.supplier_ID, p.companyName, p.addressline, p.phone])),
            
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


getOrders(){
  this.orderservice.getOrderList().subscribe(response => {
    console.log(response);
    this.dataOrder = response;
  })
  

}
generateOrdersReport(){
  
    let docDefinition = {
      content: [
        {
          text: 'Report',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'Orders',
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
              ['Orders ID', 'Supplier Name', 'Quantity', 'Amount'],
              ...this.dataOrder.map((p: { order_ID: any; supplierName: any; quantity: any; }) => ([p.order_ID, p.supplierName, p.quantity, (p.quantity).toFixed(2)])),
              [{text: 'Total Order Quantity', colSpan: 3}, {}, {}, this.dataOrder.reduce((sum: number, p: { quantity: number;  })=> sum + (p.quantity), 0).toFixed(2)]
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

  


generateWriteOffsReport(){

  
}

getInventory(){
  this.inv.getInventoryList().subscribe(response => {
    console.log(response);
    this.dataInventory = response;
  })
}

generateInventoryReport(){
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
              ['Inventory_ID', 'Inventory_Items', 'Quantity', 'Amount'],
              ...this.dataInventory.map((p: { inventory_ID: any; inventory_Items: any; quantity: any; }) => ([p.inventory_ID, p.inventory_Items, p.quantity, (p.quantity).toFixed(2)])),
              [{text: 'Total inventory', colSpan: 3}, {}, {}, this.dataInventory.reduce((sum: number, p: { quantity: number;  })=> sum + (p.quantity), 0).toFixed(2)]
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







































