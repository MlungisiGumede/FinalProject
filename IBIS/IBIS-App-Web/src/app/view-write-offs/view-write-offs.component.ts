import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WriteOffService } from '../Services/write-off.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageComponent } from '../view-image/view-image.component';
import { Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';

var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-write-offs',
  templateUrl: './view-write-offs.component.html',
  styleUrls: ['./view-write-offs.component.css']
})
export class ViewWriteOffsComponent implements OnInit {

  data:Observable<any> = new Observable();
  products: any[] = [];
  writeOffs: any;
  idtodelete :any;
  filterTerm!: string;
  reportData:any
  
  constructor(private writeOffService: WriteOffService,public router: Router,private domSanitizer:DomSanitizer
    ,private ActivatedRoute: ActivatedRoute,public matDialog: MatDialog,
    private productService: ProductService) {
      
    
    writeOffService = {} as WriteOffService;

  }

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      console.log("on loaded page")
      this.getWriteOffs()
     // this.user.password = params['user'].password
    
  })
    this.getProducts()
  }
  getProducts(){
    this.productService.getProductList().subscribe(response => {
      console.log(response);
      this.products = response;
    })
  }

  async getWriteOffs(){
    this.writeOffService.getWriteOffList().subscribe(response => {
      console.log(response);
      this.data = of(response);
      this.reportData = response;
    })
    

  }
  ViewImage(element:any){
const dialog = this.matDialog.open(ViewImageComponent, {
  data: element,
  height: '500px',
  width: '500px',
});
  }
  GetProductName(id:any){
    return this.products.find(product => product.product_ID === id).name
  }

  ReadWriteOffs(){
    this.writeOffService.getWriteOffList().subscribe((result: any) => {
  
      result.forEach((element:any) => {
        //console.log(element.image)
         // check if this is fine else change it...
        element.image = this.domSanitizer.bypassSecurityTrustUrl(element.image); // didnt assign element.image here...
    
        
      });
      
      this.data = result;
      console.log("dataSource")
      // this.productObs = of(result)
      // this.datasource = new MatTableDataSource(result);
      // //this.datasource.data = [...result]
      // this.datasource.paginator = this.paginator
      // this.datasource._updateChangeSubscription()
      // this.datasource.sortingDataAccessor
      //this.cdf.detectChanges()
      console.log("got it?")
      //this.datasource = [...this.datasource];
      //this.datasource = of(result) -- no errors here...
      //this.datasource.paginator = this.paginator;
      //this.cdf.detectChanges()
     // this.matTable.
    //this.filterArr = result
      //this.productObs = of(this.products)
    
    })
  }


  async delete(id: number){
    this.idtodelete = id;

this.writeOffService.delete(this.idtodelete).subscribe(Response => {
  console.log(Response);
  //this.data = of(Response);
this.getWriteOffs();
})
  }


  addWriteOff(){

    this.router.navigate(['/add-product']);

  }

  viewWriteoffs(){

    this.router.navigate(['/view-write-offs']);

  }

  FormBody(data:any, columns:any) { // https://stackoverflow.com/questions/26658535/building-table-dynamically-with-pdfmake
    var body:any = [];
    let index = false
  console.log(body)
  let displayedColumns = ['Write Off ID', 'Product Name','Ímage', 'Quantity', 'Reason','Transaction Type']
      body.push(displayedColumns);
      console.log(data)
       data.forEach((row:any) => {
        console.log(index)
         let dataRow:any = [];
  
          columns.forEach( (column:any) => {
            if(column == "product_ID"){
              console.log(row[column])
              row[column] = this.GetProductName(row[column])
              console.log(row[column])

            }if(column == "image"){
              console.log("hitting")
              console.log(row[column])
              row[column] =  {'image': row[column],'width': '100'}
            
              
            }if(column == "adjustment_ID"){
              console.log("hitting")
              console.log(row[column])
              if(row[column] == 1){
                row[column] = "Write Off"
              }else{
                row[column] = "Write up"
              }
              
            }
            dataRow.push(row[column]);
           })
           
           //index = true
           body.push(dataRow)
          }
          
         
       )
  
      console.log(body)
    
      console.log(body)
      return body;
  }
  FormControlBody(data:any, columns:any) { // https://stackoverflow.com/questions/26658535/building-table-dynamically-with-pdfmake
    var body:any = [];
    let index = false
  console.log(body)
  let displayedColumns = ['Write Off ID', 'Product Name','Ímage', 'Quantity', 'Reason','Transaction Type']
      body.push(displayedColumns);
      console.log(data)
       data.forEach((row:any) => {
        console.log(index)
         let dataRow:any = [];
  
          columns.forEach( (column:any) => {
            if(column == "product_ID"){
              console.log(row[column])
              row[column] = this.GetProductName(row[column])
              console.log(row[column])

            }if(column == "image"){
              console.log("hitting")
              console.log(row[column])
              row[column] =  {'image': row[column],'width': '100'}
            
              
            }if(column == "adjustment_ID"){
              console.log("hitting")
              console.log(row[column])
              if(row[column] == 1){
                row[column] = "Write Off"
              }else{
                row[column] = "Write up"
              }
              
            }
            dataRow.push([row[column],row[column]]);
           })
           
           //index = true
           body.push(dataRow)
          }
          
         
       )
  
      console.log(body)
    
      console.log(body)
      return body;
  }
  GenerateDate(){
    let date = Date.now();
    let datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }
  

  generPDF() {
    //console.log(this.FormBody(this.reportData,['image']))
    let docDefinition = {
      content: [
        {
          text: 'Reports',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'Write Off/Up report',
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
              // { 
              //   text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
              //   alignment: 'right'
              // }
            ]
          ]
        },
        {
          text: 'Report Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
           // widths: ['*', 'auto', 'auto', 'auto'],
            body: 
              this.FormBody(this.reportData,['write_Off_Id','product_ID', 'image', 'quantity', 'reason', 'adjustment_ID']),
            // add date created... or...?
              
            

          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: 'Date Generated: '+this.GenerateDate(),
            margin: [0, 0 ,0, 15]          
        },
        {
          // columns: [
          //   [{ qr: `${'this.invoice.customerName'}`, fit: '50' }],
          //   [{ text: 'Signature', alignment: 'right', italics: true}],
          // ]
        },
        {
          text: 'Description',
          style: 'sectionHeader'
        },
        {
            ul: [
              'This is a write off/up report',
              'Shows all adjustments made to stock through writing off or up',
              'Generated with PDFMake',
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


