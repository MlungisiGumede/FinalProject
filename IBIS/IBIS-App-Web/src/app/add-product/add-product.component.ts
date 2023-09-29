import { Component, OnInit,Inject, ViewChild,ChangeDetectorRef } from '@angular/core';
import { Product } from '../Models/Product';
import { ProductService } from '../Services/product.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { catchError, map, of, throwError } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Html5Qrcode, Html5QrcodeScanner} from 'html5-qrcode'
//import changedet
//import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner/public-api';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  //@ViewChild('scanner', { static: false }) scanner!: BarcodeScannerLivestreamComponent;
  barcode: any;

//data:any;
prod!: Product;
categories:any
subCategories:any
form!: FormGroup;
selectedPage:any = 1
value:any
result:any
title:any = "Step 1: Add Product"
url:any
radioList:any = [
  {
    value: 1,
    checked: false
  },
  {
    
    value: 2,
    checked: false
  }
 
]
radioList$:any = of(this.radioList)
selectedCategory: string | null = null;

// categories: string[] = ['Meat', 'Vegetables', 'Sides'];
//   subcategories: { [key: string]: string[] } = {
//     'Meat': ['Pork', 'Beef', 'Lamb', 'Chicken', 'Fish'],
//     'Vegetables': ['Pumpkin', 'Lettuce', 'Potatoes', 'Butternut'],
//     'Sides': ['Chakalaka', 'Atchaar']
//   };
  filteredSubcategories: any


  constructor(private prodService: ProductService, public router:Router,
     private fb: FormBuilder, private toastController: ToastController,
     private dialogRef:MatDialogRef<AddProductComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
     private cd:ChangeDetectorRef){
    //this.data = new Product();
   this.categories = this.data.categories
   
   console.log(this.categories)
   this.subCategories = this.data.subCategories
   console.log(this.subCategories)
  } 
  ConsoleLog(){
    console.log(this.value)
    this.value = 1
  }
  startScan() {
    var html5QrcodeScanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      false
    );
   
    //html5QrcodeScanner.s
    html5QrcodeScanner.render(this.onScanSuccess,this.onScanFailure);
  }
  ScanFile(e:any){ 
    // input text with scanned image...
    // get code type as well like 128...
    const imageFile = e.target.files[0];
    this.barcode = imageFile
    const html5QrCode = new Html5Qrcode(/* element id */ 'reader');
    html5QrCode.scanFile(this.barcode).then((result:any) => {
      console.log(result)
      this.form.get('sku')?.setValue(result)
      this.FileChoice(e)
      //alert(result)
      //this.cd.detectChanges()
    }).catch((error:any) => {
      
      this.form.get('identifier')?.setValue("")
      alert("failiure to scan")
      //alert(error)
    });
    ;
  }
  FileChoice(e:any){
    console.log(this.form.value)
    let file = e.target.files[0];
    console.log(file)
    let reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => {
     //me.modelvalue = reader.result;
     console.log(reader.result);
     this.url = reader.result
     
     // let val = (this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.setValue(false)
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
  }
  
  
  onScanSuccess(decodedText:any) {
    // handle the scanned code as you like, for example:
    alert(decodedText)
    console.log(`Code matched = ${decodedText}`);
  }

  onScanFailure(error:any) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }
 
PageForward(){
  let page = this.selectedPage
  this.form.get('page')?.setValue(this.selectedPage+1)
  this.selectedPage = this.selectedPage+1
  this.title = "Step 2: Add Identifier (optional)"
  this.cd.detectChanges()
  console.log(this.form.get('page')?.value)
  //this.radioList$ = of(...this.radioList)
}
PageBackward(){
  let page = this.selectedPage
  this.form.get('page')?.setValue(this.selectedPage-1)
  this.selectedPage = this.selectedPage-1
  this.title = "Step 1: Add Product"
}
  ngOnInit(): void {
   
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      expiry: [null, [Validators.required, this.minExpiryDateValidator.bind(this)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      sku: ['', ],
      subCategory_ID: [null, Validators.required],
      category_ID: [null, Validators.required],
      page: [1],
    });
  

    
  }
  // onValueChanges(result: any) {
  //   console.log("change")
  //   this.barcode = result.codeResult.code;
  //   alert(this.barcode)
  // }

  minExpiryDateValidator(control: any): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minExpiryDate = new Date(today);
    minExpiryDate.setDate(today.getDate() + 10); // Minimum expiry date is 10 days from now

    if (selectedDate < minExpiryDate) {
      return { 'minExpiryDate': true };
    }
    return null;
  }
  
  validateExpiryDate() {
    const expiryDateControl = this.form.get('expiryDate');
    if (expiryDateControl) {
      expiryDateControl.updateValueAndValidity();
    }
  }
  

 

  AddProduct(){

    // let newProd = new Product()
    // newProd.name = this.form.controls['productName'].value
    // newProd.price = this.form.controls['price'].value
    // newProd.category_ID = this.form.controls['category'].value
    // newProd.subCategory_ID = this.form.controls['subcategory'].value
    // newProd.quantity = this.form.controls['quantity'].value
    // newProd.expiry = this.form.controls['expiryDate'].value
    console.log(this.form)
console.log(this.form.value)

    this.prodService.createProduct(this.form.value).pipe(map(
      (res)=>{




    }),
    catchError((err) =>{
      console.log(err)
      this.dialogRef.close(false);
     
      return throwError(err)
    })).
subscribe(res => {
      console.log('success', res);
      this.presentToast('top');
      this.router.navigate(["/Products"]);
      this.dialogRef.close(true);
    })

    // this.prodService.createProduct(this.data).subscribe(res=>{
    // console.log("success", res);
    // })  
  }

  onCategoryChange(event: any) {
    this.form.get('subCategory_ID')?.setValue(null);
    const selectedCategory = event.target.value;
    this.selectedCategory = selectedCategory;
    this.filteredSubcategories = []
    console.log(this.subCategories)
    this.subCategories.forEach((element:any) => {
      console.log(element)
      if(element.category_ID == selectedCategory){
        this.filteredSubcategories.push(element)
      }
    });
    //this.filteredSubcategories = this.selectedCategory
    console.log(this.filteredSubcategories)
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Product successfully created',
      duration: 5000,
      position: position,
      color: 'success'
    });
  
    await toast.present();
  }

}

