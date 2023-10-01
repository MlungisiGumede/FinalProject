import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ChartDataset, ChartType, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewProductComponent } from '../view-product/view-product.component';
import { ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { AddSubCategoryComponent } from '../add-sub-category/add-sub-category.component';
import { WriteOff } from '../Models/writeOff';
import { WriteOffService } from '../Services/write-off.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsHelpComponent } from '../products-help/products-help.component';
//import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner/lib/barcode-scanner-livestream';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import {Html5QrcodeScanner} from 'html5-qrcode'
import { LoginService } from '../Services/login.service';

var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare var myChart: any;


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
 // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  //@ViewChild('scanner', { static: false }) scanner!: BarcodeScannerLivestreamComponent;
barcode: any;
  data:Observable<any> = new Observable();
  data2: Product[] = [];
  reportData:any
  products: any
  idtodelete :any;
  search= "";
  productItems: any;
  itemNames: any;
  itemQuantities: any;
  filterTerm!: string;
  categories:any
  subCategories:any
  edited:any
  request:any
  quantity:any
  price:any
  title:any = "Products"
  form:any
  permissions:any
  role:any
  isSupported = true;
  radioList:any = [{
    'id':1,
    'value':1,

  }]

  barcodes: Barcode[] = [];
  combinedData: { Name: string, Quantity: number , Price: number}[] = [];

  constructor(private productService: ProductService,public router: Router,private toastController: ToastController
    ,private matDialog:MatDialog,private _snackbar: MatSnackBar,private writeOffService:WriteOffService,public helpModal: ModalController
    ,private alertController: AlertController,private loginService:LoginService) {
      
    
    productService = {} as ProductService;
  }
  onValueChanges(result: any) {
    console.log("change")
    this.barcode = result.codeResult.code;
    alert(this.barcode)
  }
  startScan() {
    // var html5QrcodeScanner = new Html5QrcodeScanner(
    //   'reader',
    //   { fps: 10, qrbox: 250 },
    //   false
    // );
    // html5QrcodeScanner.render(this.onScanSuccess,this.onScanFailure);
  }
  
  // onScanSuccess(decodedText:any) {
  //   // handle the scanned code as you like, for example:
  //   alert(decodedText)
  //   console.log(`Code matched = ${decodedText}`);
  // }

  // onScanFailure(error:any) {
  //   // handle scan failure, usually better to ignore and keep scanning.
  //   // for example:
  //   console.warn(`Code scan error = ${error}`);
  // }
 


  async scan(): Promise<void> {
    console.log("hi")
    //const granted = await this.requestPermissions();
    // if (!granted) {
    //   this.presentAlert();
    //   return;
    // }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
  }
  

  

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  // ngAfterViewInit() {
  //   this.scanner.start();
  //   this.scanner._valueChanges.subscribe(res => {
  //     alert(res)
  //   })
    //this.scanner.
 // }

  ngOnInit() {
    this.GetUserRole()
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    this.form = new FormGroup({
     
      price: new FormControl("",[Validators.required, Validators.min(1)]),
    })
    this.getProducts()
    this.productService.getCategoriesList().subscribe((res)=>{
      console.log(res)
      this.categories = res
    })
    this.productService.getSubCategoriesList().subscribe((res)=>{
      console.log(res)
      this.subCategories = res
    })

    
    // this.data2 = [
    //   { product_ID: 1, product_Name: 'Product A', quantity: 10, price: 30 },
    //   { product_ID: 2, product_Name: 'Product B', quantity: 15, price: 50 },
    //   { product_ID: 3, product_Name: 'Product C', quantity: 8, price: 44 },
    //   { product_ID: 4, product_Name: 'Product D', quantity: 20, price: 25 },
    //   { product_ID: 5, product_Name: 'Product E', quantity: 5, price: 30 }
    // ];

  }
  CheckPermission(){
    if(this.role == "manager"){
        
      return true
     }
   
      console.log(this.permissions)
        let index = this.permissions.findIndex((element:any) => element.permission_ID == 7)
        console.log(index)
      if(index > -1){
        return true
      }else{
       
        return false
      
      }
  return
}
  async GetUserRole(){
    let value = new Promise((resolve, reject) => {
      this.loginService.GetUserRole().subscribe((res) => {
        this.permissions = res.permissions
        this.role = res.role
        console.log(res)
       //alert(this.permissions)
        resolve(res)
      }), (error: any) => {
        reject(error)
      }
    })
    await value
    return value
  }
  WriteOffScreen(item:any){
if(this.request == "write-off"){
  item.type = 1
}else{
  item.type = 2
}
this.writeOffService.adjustQuantity.next(item)
this.router.navigate(['/write-off'])
  }

  async getProducts(){
   
    let val = new Promise((resolve, reject) => {
      this.productService.getProductList().subscribe(response => {
        console.log(response);
        this.data = of(response)
        this.products = response
        this.reportData = response
        console.log(this.data)
        resolve(true)
      }), (error:any) => {
        resolve(false)
      }
    })
    await val

    
    
  }
  AddCategory(){
const dialogRef = this.matDialog.open(AddCategoryComponent,{
  //width: '250px',
  //height: '200px'
});
dialogRef.afterClosed().subscribe((res:any) => {
  console.log(res)
  console.log(res.data)
  if(res){
    console.log("hi")
    this.ShowSnackBar("Category successfully added", "success");
    this.productService.getCategoriesList().subscribe((res)=>{
      console.log(res)
      this.categories = res
    })
   
     
  }else if(res == false){
    this.ShowSnackBar("Category could not be added", "error");
   
}
})

  }
  AddSubCategory(){

    const dialogRef = this.matDialog.open(AddSubCategoryComponent);
    dialogRef.afterClosed().subscribe((res:any) => {
      console.log(res)
      console.log(res.data)
      if(res){
        console.log("hi")
        this.ShowSnackBar("SubCategory successfully added", "success");
        this.productService.getSubCategoriesList().subscribe((res)=>{
          console.log(res)
          this.subCategories = res
        })
       
         
      }else if(res == false){
        this.ShowSnackBar(" SubCategory could not be added", "error");
       
    }
    })
  }
  GetCategoryName(id:any){
    return this.categories.find((item:any) => item.category_ID == id).name
  }
  GetSubCategoryName(id:any){
    return this.subCategories.find((item:any) => item.subCategory_ID == id).name
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: ProductsHelpComponent});
      return await modal.present();
  }

  async delete(id: number){
    this.idtodelete = id;

    this.productService.delete(this.idtodelete).pipe(map(
      (res)=>{

    }),
    catchError((err) =>{
      console.log(err)
      if(err.status == 400){
        this.ShowSnackBar(err.error, "error");
      }else{
        this.ShowSnackBar("failed to remove product", "error");
      }
      
      return throwError(err)
    })).subscribe(() => {
      
      
        this.ShowSnackBar("Product successfully removed", "success");
       
      this.getProducts();
    }), () => {
      //console.log(error);
      console.log("hit")
      
    }
  }
ViewProduct(item:any){
  let dialogRef:any = []
  //this.categories = {"category_ID":item.category_ID,"name":item.category_Name}
  if(this.categories && this.subCategories){
  dialogRef = this.matDialog.open(ViewProductComponent,{
    data:{'product':item,'categories':this.categories,'subCategories':this.subCategories}
  })
}
  dialogRef.afterClosed().subscribe((result:any) => {
    if(result){
      this.ShowSnackBar("Product successfully updated", "success");
      this.getProducts();
    }else if(result == false){
      this.ShowSnackBar("failed to update product", "error");
    }
  })
}
AddQuantity(item:Product){

this.request = "quantity"
this.edited = true
this.AssignProduct(item)
}
AssignProduct(item:any){
  let products = []
  let product = this.products.find((product:any) => product.product_ID == item.product_ID)
  console.log(product)
  products.push(product)
  this.data = of(products)
}
UpdatePrice(item:Product){
  this.request = "price"
  this.price = item.price
  this.edited = true
  this.AssignProduct(item)
}
OnDone(item:Product){
  this.edited = false
  let product:any = this.products.find((product:any) => product.product_ID == item.product_ID)
  if(this.request=="quantity"){
    // nah rather API call then in subscribe reset the data...
   
    product.quantity = product.quantity + this.quantity
    // below in an function...
    this.productService.updateProduct(product).subscribe(()=>{
      this.request = ""
      this.getProducts()
    })
    
  }else{
    product.price = this.price
    this.productService.updateProduct(product).pipe(map(
      (res)=>{






    }),
    catchError((err) =>{
      console.log(err)
      this.ShowSnackBar("failed to update price", "error");
     
      return throwError(err)
    }))
.subscribe(()=>{
      this.request = ""
      this.ShowSnackBar("successfully updated price", "success");
      this.getProducts()
    })
  }
 
 
}
  addproduct(){
    let dialogRef:any = []
    //if(this.categories && this.subCategories){
      dialogRef = this.matDialog.open(AddProductComponent,{
        data:{'categories':this.categories,'subCategories':this.subCategories},
        width:'100%',
        height:'100%'
      });
   // }


    //this.router.navigate(['/add-product']);
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.ShowSnackBar("Product successfully added", "success");
        this.getProducts();
      }else if(result == false){
        this.ShowSnackBar("failed to add product", "error");
      }
    })
  }
  Cancel(){
    this.request = ""
    this.edited = false
    this.getProducts()
  }
  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "close", {
      duration: 5000,
      panelClass: [panel]
      
    });
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
  GenerateCategoryPDF() {
    let categoryNames = this.categories.map((item: any) => {
      return item.name // generated through the ai thingy not all...
    })
    console.log(categoryNames);
    let docDefinition = {
      content: [
        {
          text: 'Control Break Report', // or just report maybe...
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'Category Report',
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
          table: {
            headerRows: 1,
            body: [
                    categoryNames,
                    // [
                          
                    //       //   [
                              
                    //       //       {
                    //       //           table: {
                    //       //               body: [
                    //       //                   [ 'Col1', 'Col2', 'Col3'],
                    //       //                   [ '1', '2', '3'],
                    //       //                   [ '1', '2', '3']
                    //       //               ]
                    //       //           },
                    //       //       }
                    //       //   ], [
                              
                    //       //     {
                    //       //         table: {
                    //       //             body: [
                    //       //                 [ 'Col1', 'Col2', 'Col3'],
                    //       //                 [ '1', '2', '3'],
                    //       //                 [ '1', '2', '3']
                    //       //             ]
                    //       //         },
                    //       //     }
                    //       // ]
                    // ]
            ]
          }
        }
     ] }
    // pdfMake.createPdf(docDefinition).download();
     //pdfMake.createPdf(docDefinition).print();      
  
     pdfMake.createPdf(docDefinition).open();  
  }  
 
  FormBody(data:any, columns:any) { // https://stackoverflow.com/questions/26658535/building-table-dynamically-with-pdfmake
    var body = [];
  console.log(data)
  let displayedColumns = ['Product ID','Name','Category Name','SubCategory Name','Price','Quantity','SKU']
  console.log(columns)
      body.push(displayedColumns);
      //this.reportData.map()
  console.log(data.values())
       data.forEach((row:any) => {
         let dataRow:any = [];
          
          columns.forEach( (column:any) => {
            if(column == "category_ID"){
              row[column] = this.GetCategoryName(row[column])
               }
               if(column == "subCategory_ID"){
                row[column] = this.GetSubCategoryName(row[column])
                 }
              dataRow.push(row[column]);
      
           })
           body.push(dataRow)
          }
         
       )
  
      
      console.log(body)
      console.log(body)
      return body;
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
          text: 'Report Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            // widths: ['*', 'auto', 'auto', 'auto'],
            body: this.FormBody(this.reportData, ['product_ID','name','category_ID','subCategory_ID','price','quantity','sku'])
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


