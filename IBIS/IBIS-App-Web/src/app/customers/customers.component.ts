import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ng2SearchPipe } from 'ng2-search-filter/src/ng2-filter.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../Services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { ViewCustomerComponent } from '../view-customer/view-customer.component';
import { ChangeDetectorRef } from '@angular/core';
import { AddCustomerOrderComponent } from '../add-customer-order/add-customer-order.component';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
data:any
filterTerm!:string;
  constructor(public matDialog:MatDialog,private customerSerivce : CustomerService ,public toastController: ToastController
    ,public cdr:ChangeDetectorRef) { }

  ngOnInit() {
//localStorage.removeItem("Token")
 console.log(localStorage.getItem('Token'))
 console.log(localStorage.getItem('OTP'))

    



    this.getCustomers()
  }

  getCustomers(){
    this.customerSerivce.getCustomerList().subscribe(response => {
      console.log(response);
      this.data = response;
      this.cdr.detectChanges()
      //console.log(this.data[0].inventory_ID);
      
      //this.inID = this.data[0].inventory_ID;
    


      //let inventory = JSON.stringify(response.inventory_ID);
      
     // console.log('this is:',JSON.stringify(response['inventory_ID']))
    // console.log('finally',response);
     
    })
    

  }
  AddCustomerOrder(item:any){
  const dialogRef = this.matDialog.open(AddCustomerOrderComponent,{
    data: item,
    //width:'50%'
  })
  }


  async DeleteCustomer(id: any){
     

this.customerSerivce.DeleteCustomer(id).subscribe(Response => {
  console.log(Response);
  this.data = Response;
this.getCustomers();
this.presentToast('top',"Customer successfully edited","success") 
} ,err=>{
 this.presentToast('top',"Error Customer could not be edited","error")
})
  }



  AddCustomer(){

    const dialogRef = this.matDialog.open(AddCustomerComponent,{
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe((res:any) => {
      console.log(res)
      console.log(res.data)
      if(res.data == 'success'){
        console.log("hi")
        this.getCustomers()
        
        this.presentToast('top',"Customer successfully added","success") 
      }else{
       this.presentToast('top',"Error customer could not added","error")
      }
    })

  }

  OnEdit(element:any){
   const dialogRef = this.matDialog.open(ViewCustomerComponent,{
      panelClass: 'custom-dialog-container',
      data: element
    });
    dialogRef.afterClosed().subscribe((res:any) => {
      console.log(res)
      console.log(res.data)
      if(res == 'success'){
        console.log("hi")
        this.getCustomers()
        
        this.presentToast('top',"Customer successfully updated","success") 
      }else{
       this.presentToast('top',"Error customer could not be edited","error")
      }
    })
  }

  // public openPDF(): void {
  //   let DATA: any = document.getElementById('htmlData');
  //   html2canvas(DATA).then((canvas) => {
  //     let fileWidth = 208;
  //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
  //     const FILEURI = canvas.toDataURL('image/png');
  //     let PDF = new jsPDF('p', 'mm', 'a4');
  //     let position = 0;
  //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  //     PDF.save('angular-demo.pdf');
  //   });
  // }

  // generatePDF() {  
  //   let docDefinition = {  
  //     content: [  
  //       {  
  //         text: 'Products Report',  
  //         fontSize: 16,  
  //         alignment: 'center',  
  //         color: '#047886'  
  //       },  
  //       {  
  //         text: '2023',  
  //         fontSize: 20,  
  //         bold: true,  
  //         alignment: 'center',  
  //         decoration: 'underline',  
  //         color: 'skyblue'  
  //       },
  //     ]

  //   };  
   
  //   pdfMake.createPdf(docDefinition).open();  
  // }  







  // genPDF() {

    


  //   this.inv.getInventoryList().subscribe(response => {
  //     console.log(response);
  //     this.data = response;
  //     //this.inventory = response.Inventory_ID
  //   })





  //   let docDefinition = {
  //     content: [
  //       {
  //         text: 'Inventory Report',
  //         fontSize: 16,
  //         alignment: 'center',
  //         color: '#FFD700'
  //       },
  //       {
  //         text: 'IN-Stock',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'skyblue'
  //       },
  //       {
  //         text: 'Inventory',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         columns: [
  //           [
  //             {
  //               text: this.inID,
  //               bold:true
  //             },
  //             { text: ''},
  //             { text: this.inventory},
  //             { text: this.inventory}
  //           ],
  //           [
  //             {
  //               text: `Date: ${new Date().toLocaleString()}`,
  //               alignment: 'right'
  //             },
  //             { 
  //               text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
  //               alignment: 'right'
  //             }
  //           ]
  //         ]
  //       },
  //       {
  //         text: 'Order Details',
  //         style: 'sectionHeader'
  //       },
  //       {
         
  //           table: {
  //             headerRows: 1,
  //             width: ['*', 'auto', 'auto', 'auto'],
  //             body: [
  //               [{text:'Service: '}],
  //               [{text:'Dealership: ', bold: true,}],
  //               [{text:'Team: ', bold: true,}],
  //               [{text:'Service Type: ', bold: true,}],
  //             ]
  //           }
          
  //       },
  //       {
  //         text: 'Additional Details',
  //         style: 'sectionHeader'
  //       },
  //       {
  //           text: 'this.invoice.additionalDetails',
  //           margin: [0, 0 ,0, 15]          
  //       },
  //       {
  //         columns: [
  //           [{ qr: '`${this.invoice.customerName}`', fit: '50' }],
  //           [{ text: 'Signature', alignment: 'right', italics: true}],
  //         ]
  //       },
  //       {
  //         text: 'Terms and Conditions',
  //         style: 'sectionHeader'
  //       },
  //       {
  //           ul: [
  //             'Order can be return in max 10 days.',
  //             'Warrenty of the product will be subject to the manufacturer terms and conditions.',
  //             'This is system generated invoice.',
  //           ],
  //       }
  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,
  //         decoration: 'underline',
  //         fontSize: 14,
  //         margin: [0, 15,0, 15]          
  //       }
  //     }
  //   };

    
  //     pdfMake.createPdf(docDefinition).download();
   
  //     //pdfMake.createPdf(docDefinition).print();      
   
  //     pdfMake.createPdf(docDefinition).open();      
  //   }

  








    async presentToast(position: 'top' | 'middle' | 'bottom',message:any,operation:any) {
      const toast = await this.toastController.create({
        message: message,
        duration: 5000,
        position: position,
        color: operation
      });
      await toast.present();
    }




















  // generPDF() {
  //   let docDefinition = {
  //     content: [
  //       {
  //         text: 'Reports',
  //         fontSize: 16,
  //         alignment: 'center',
  //         color: '#047886'
  //       },
  //       {
  //         text: 'New Report',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'skyblue'
  //       },
  //       {
  //         text: 'Details',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         columns: [
  //           [
  //             {
  //               text: 'this.invoice.customerName',
  //               bold:true
  //             },
  //             { text: 'this.invoice.address' },
  //             { text: 'this.invoice.email '},
  //             { text: 'this.invoice.contactNo' }
  //           ],
  //           [
  //             {
  //               text: `Date: ${new Date().toLocaleString()}`,
  //               alignment: 'right'
  //             },
  //             { 
  //               text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
  //               alignment: 'right'
  //             }
  //           ]
  //         ]
  //       },
  //       {
  //         text: 'report Details',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', 'auto', 'auto', 'auto'],
  //           body: [
  //             ['Inventory_ID', 'Inventory_Items', 'Quantity', 'Amount'],
  //             ...this.data.map((p: { inventory_ID: any; inventory_Items: any; quantity: any; }) => ([p.inventory_ID, p.inventory_Items, p.quantity, (p.quantity).toFixed(2)])),
  //             [{text: 'Total inventory', colSpan: 3}, {}, {}, this.data.reduce((sum: number, p: { quantity: number;  })=> sum + (p.quantity), 0).toFixed(2)]
  //           ]
  //         }
  //       },
  //       {
  //         text: 'Additional Details',
  //         style: 'sectionHeader'
  //       },
  //       {
  //           text: 'this.invoice.additionalDetails',
  //           margin: [0, 0 ,0, 15]          
  //       },
  //       {
  //         columns: [
  //           [{ qr: `${'this.invoice.customerName'}`, fit: '50' }],
  //           [{ text: 'Signature', alignment: 'right', italics: true}],
  //         ]
  //       },
  //       {
  //         text: 'Terms and Conditions',
  //         style: 'sectionHeader'
  //       },
  //       {
  //           ul: [
  //             'Order can be return in max 10 days.',
  //             'Warrenty of the product will be subject to the manufacturer terms and conditions.',
  //             'This is system generated invoice.',
  //           ],
  //       }
  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,
  //         decoration: 'underline',
  //         fontSize: 14,
  //         margin: [0, 15,0, 15]          
  //       }
  //     }
  //   };

   
  //     pdfMake.createPdf(docDefinition).download();
  //     //pdfMake.createPdf(docDefinition).print();      
   
  //     pdfMake.createPdf(docDefinition).open();      
   

  // }

}
