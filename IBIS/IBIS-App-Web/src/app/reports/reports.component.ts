import { Component, OnInit } from '@angular/core';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/Product';
import { InventoryService } from '../Services/inventory.service';
import { SupplierService } from '../Services/supplier.service';
import { OrdersService } from '../Services/orders.service';
import { WriteOffService } from '../Services/write-off.service';
import { Chart,registerables } from 'chart.js';
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
  customerOrdersChart:any
  customerOrders:any
  supplierOrders:any
  customerOrderLine:any
  supplierOrderLine:any
  isCustomerOrder:any = false
  supplierOrdersChart:any
  
  combinedData: { Name: string, Quantity: number, Price: number }[] = [];
  constructor(private productService: ProductService, private route: ActivatedRoute,
     private inv : InventoryService,private supply: SupplierService,private orderservice : OrdersService, private writeOffService : WriteOffService
     ,public orderService:OrdersService) {
      Chart.register(...registerables);
      }

  ngOnInit() {
    this.orderService.getOrders().subscribe(response => {
      console.log(response)
     this.customerOrders = response[0]
     this.supplierOrders = response[1]
     this.customerOrderLine = response[4]
     this.supplierOrderLine = response[5]
     console.log(this.customerOrders)
     console.log(this.supplierOrders)
    })

    this.getInventory();
    this.getProducts();
    this.getSuppliers();
    this.getOrders();
    this.getwriteOffs();


    this.route.queryParams.subscribe((params) => {
      this.combinedData = JSON.parse(params['combinedData'] || '[]');
      // const combinedData: { Name: string, Quantity: number }[] = JSON.parse(params['combinedData'] || '[]');
      const itemNames: string[] = this.combinedData.map(item => item.Name);
      const itemQuantities: number[] = this.combinedData.map(item => item.Quantity);
      const itemPrices: number[] = this.combinedData.map(item =>item.Price )
      console.log('yes we received the data from the product component', this.combinedData)
      
    });
  }
CreateSupplierOrdersChart(){
  this.isCustomerOrder = false
  let doneOrders = this.supplierOrders.filter((item:any) => item.orderStatus_ID == 2)
 let doneOrdersLength = this.supplierOrders.filter((item:any) => item.orderStatus_ID == 2).length
 let cancelledOrders = this.supplierOrders.filter((item:any) => item.orderStatus_ID == 3)
 let cancelledOrdersLength = this.supplierOrders.filter((item:any) => item.orderStatus_ID == 3).length
 let inProgressOrders = this.supplierOrders.filter((item:any) => item.orderStatus_ID == 1)
 let inProgressOrdersLength = this.supplierOrders.filter((item:any) => item.orderStatus_ID == 1).length
// then canculate the order line...
console.log(inProgressOrders)
let doneTotal = this.CalculateSupplierOrdersTotal(doneOrders)
let cancelledTotal = this.CalculateSupplierOrdersTotal(cancelledOrders)
let inProgressTotal = this.CalculateSupplierOrdersTotal(inProgressOrders)
console.log(inProgressOrdersLength)
 console.log(doneOrders)
 let customerOrderschart = Chart.getChart("customerOrdersChart")
 let supplierOrderschart = Chart.getChart("supplierOrdersChart")
 if(customerOrderschart){
   customerOrderschart.destroy()
 }if(supplierOrderschart){
   supplierOrderschart.destroy()
 }
    this.supplierOrdersChart = new Chart("supplierOrdersChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['In Progress', 'Cancelled', 'Done' ], 
	       datasets: [
          {
            label: "Average cost per order (R)",
            data: [inProgressTotal/inProgressOrdersLength,doneTotal/doneOrdersLength, cancelledTotal/cancelledOrdersLength],
            backgroundColor: 'blue'
          },
          {
            label: "Total (R)",
            data: [inProgressTotal, doneTotal, cancelledTotal],
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
    console.log(this.supplierOrdersChart)
  
}
  CreateCustomerOrdersChart(){
    this.isCustomerOrder = true
 //this.supplierOrders filter the list...
 let doneOrders = this.customerOrders.filter((item:any) => item.orderStatus_ID == 2)
 let doneOrdersLength = this.customerOrders.filter((item:any) => item.orderStatus_ID == 2).length
 let cancelledOrders = this.customerOrders.filter((item:any) => item.orderStatus_ID == 3)
 let cancelledOrdersLength = this.customerOrders.filter((item:any) => item.orderStatus_ID == 3).length
 let inProgressOrders = this.customerOrders.filter((item:any) => item.orderStatus_ID == 1)
 let inProgressOrdersLength = this.customerOrders.filter((item:any) => item.orderStatus_ID == 1).length
// then canculate the order line...
console.log(inProgressOrders)
let doneTotal = this.CalculateCustomerOrdersTotal(doneOrders)
let cancelledTotal = this.CalculateCustomerOrdersTotal(cancelledOrders)
let inProgressTotal = this.CalculateCustomerOrdersTotal(inProgressOrders)
console.log(inProgressOrdersLength)
 console.log(doneOrders)
 let customerOrderschart = Chart.getChart("customerOrdersChart")
 let supplierOrderschart = Chart.getChart("supplierOrdersChart")
 if(customerOrderschart){
   customerOrderschart.destroy()
 }if(supplierOrderschart){
   supplierOrderschart.destroy()
 }
 
    this.customerOrdersChart = new Chart("customerOrdersChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['In Progress', 'Cancelled', 'Done' ], 
	       datasets: [
          {
            label: "Average cost per order (R)",
            data: [inProgressTotal/inProgressOrdersLength,doneTotal/doneOrdersLength, cancelledTotal/cancelledOrdersLength],
            backgroundColor: 'blue'
          },
          {
            label: "Total (R)",
            data: [inProgressTotal, doneTotal, cancelledTotal],
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
    console.log(this.customerOrdersChart)
  }




    invoice = new Invoice(); 
    
    CalculateCustomerOrdersTotal(orders:any){
      let total = 0
      console.log(this.customerOrderLine)
      orders.forEach((element:any) => {
        console.log(element)
        // get orderLine then 
        this.customerOrderLine.forEach((orderLine:any) => {
          console.log(orderLine)
          if(orderLine.customerOrder_ID == element.customerOrder_ID){
            total = total + (orderLine.quantity * orderLine.price)
        }
      })
      
        
      });
      return total
    }
    CalculateSupplierOrdersTotal(orders:any){
      let total = 0
      console.log(this.customerOrderLine)
      orders.forEach((element:any) => {
        console.log(element)
        // get orderLine then 
        this.supplierOrderLine.forEach((orderLine:any) => {
          console.log(orderLine)
          if(orderLine.supplierOrder_ID == element.supplierOrder_ID){
            total = total + (orderLine.quantity * orderLine.price)
        }
      })
      
        
      });
      return total
    }
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
        text: 'Supplier Report',
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
            '',
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
          text: 'Orders report',
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
              { text: ''},
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
              '',
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

  

  async getwriteOffs(){
    this.writeOffService.getWriteOffList().subscribe(response => {
      console.log(response);
      this.dataWriteOff = response;
    })
    

  }
generateWriteOffsReport(){
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
            ...this.dataWriteOff.map((p: { write_Off_Id: any; item_name: any; quantity_Written_Off: any; reason: any}) => ([p.write_Off_Id, p.item_name, p.quantity_Written_Off, p.reason])),
            
          ]
        }
      },
      {
        text: 'Additional Details',
        style: 'sectionHeader'
      },
      {
          text: '',
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
            '',
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
          text: 'Inventory Report',
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
            text: 'information',
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
              '',
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







































