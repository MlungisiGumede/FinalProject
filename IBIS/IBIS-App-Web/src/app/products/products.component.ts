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
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewProductComponent } from '../view-product/view-product.component';
import { ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { AddSubCategoryComponent } from '../add-sub-category/add-sub-category.component';

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
  data:Observable<any> = new Observable();
  data2: Product[] = [];
  reportData:any
  products: Product[] = [];
  idtodelete :any;
  search= "";
  productItems: any;
  itemNames: any;
  itemQuantities: any;
  filterTerm!: string;
  categories:any
  subCategories:any
  


  combinedData: { Name: string, Quantity: number , Price: number}[] = [];

  constructor(private productService: ProductService,public router: Router,private toastController: ToastController
    ,private matDialog:MatDialog,private _snackbar: MatSnackBar) {
      
    
    productService = {} as ProductService;
  }

  ngOnInit() {
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

  async getProducts(){
    let val = new Promise((resolve, reject) => {
      this.productService.getProductList().subscribe(response => {
        console.log(response);
        this.data = of(response)
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
  }
  AddSubCategory(){

    const dialogRef = this.matDialog.open(AddSubCategoryComponent);
  }
  GetCategoryName(id:any){
    return this.categories.find((item:any) => item.category_ID == id).name
  }
  GetSubCategoryName(id:any){
    return this.subCategories.find((item:any) => item.subCategory_ID == id).name
  }

  async delete(id: number){
    this.idtodelete = id;

    this.productService.delete(this.idtodelete).pipe(map(
      (res)=>{

    }),
    catchError((err) =>{
      console.log(err)
      this.ShowSnackBar("failed to remove product", "error");
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

  addproduct(){
    let dialogRef:any = []
    if(this.categories && this.subCategories){
      dialogRef = this.matDialog.open(AddProductComponent,{
        data:{'categories':this.categories,'subCategories':this.subCategories}
      });
    }

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
 
  FormBody(data:any, columns:any) { // https://stackoverflow.com/questions/26658535/building-table-dynamically-with-pdfmake
    var body = [];
  console.log(data)
  let displayedColumns = ['Product ID','Name','Category Name','SubCategory Name','Price','Quantity','Expiry Date']
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
  
         
      // 
      
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
            body: this.FormBody(this.reportData, ['product_ID','name','category_ID','subCategory_ID','price','quantity','expiry'])
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


