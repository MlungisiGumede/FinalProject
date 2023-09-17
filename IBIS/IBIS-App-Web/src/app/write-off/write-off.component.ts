import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';
import { ProductService } from '../Services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera,CameraResultType,CameraSource,Photo } from '@capacitor/camera';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { WriteOffService } from '../Services/write-off.service';
import { WriteOff } from '../Models/writeOff';
import { DomSanitizer } from '@angular/platform-browser';
import { every, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map,catchError, throwError } from 'rxjs';



const IMAGE_DIR = 'stored-images';

interface LocalFile {
name: string;
path: string;
data: string;

}



@Component({
  selector: 'app-write-off',
  templateUrl: './write-off.component.html',
  styleUrls: ['./write-off.component.css']
})
export class WriteOffComponent implements OnInit {

images: LocalFile[]=[];

  newWriteOff!: WriteOff;
  id: any;
  data:any;
  form : FormGroup = new FormGroup({});
  pic: any;
  datawr:any;
  image:any
  fileName:any = "required"
  uploadFile:any
  categories:any
  subCategories:any
  title:any
  product:any
  type$:any
  type:any
  text:any
  quantity:any
  buttonText:any

  

  constructor(private route : ActivatedRoute,private productService: ProductService,private fb : FormBuilder, private loadingCtrl: LoadingController,private writeoffservice: WriteOffService
    ,private router: Router, private _snackBar: MatSnackBar) {
    
    
    this.datawr = new WriteOff();
  }


  

  ngOnInit(): void {
    this.form= this.fb.group({
      // product_ID : ['', Validators.required],
         reason : ['', Validators.required],
        image: ['', Validators.required],
         quantity : ['', Validators.required],
       })
       let products:any = []
  this.AdjustQuantity().then(
    (success)=>{
      console.log("adjust")
      this.GetCategories().then(
        (success)=>{
          console.log("cat")
          this.GetSubCategories().then(
            (success)=>{
              console.log("sub")
            products.push(this.product)
            console.log(products)
             this.data = of(products)
             this.data = [...this.data]
             this.data.subscribe(
               (success:any)=>{
                 console.log(success)
               }
             )
            })
        }
      )
    }
  )



this.data = of(products)
//this.loadFiles();
  }
  async GetCategories(){
  let value = new Promise((resolve, reject) => {
    this.productService.getCategoriesList().subscribe((success)=>{
      this.categories = success
      resolve(success)
    }),(error:any)=>{
      reject(error)
    }
  })
  await value
  return value
  }
  async AdjustQuantity(){
 let value = new Promise((resolve, reject) => {   this.writeoffservice.adjustQuantity.subscribe((res)=>{
      console.log(res)
      console.log(res[0])
      if(res.type == 1){
     this.type$ = of(1)
     this.buttonText = "Write Off"
     this.type = 1
     this.form= this.fb.group({
      // product_ID : ['', Validators.required],
         reason : ['', Validators.required],
        image: ['', Validators.required],
         quantity : ['', [Validators.required,Validators.max(res.quantity)]],
       })
      this.quantity = res.quantity
this.title = "Write Off"
this.text ="Enter amount to write off" // could maybe display but could do ngif without additional thingy before stuff loaded

      }else{
        this.buttonText = "Write Up"
        this.form.controls['reason'].setValue("write up") // date for write offs as well...
        this.title = "Write Up:"
        this.text = "Enter amount to write Up"
        this.type = 2
      }
      this.product = res
      console.log(this.product)
      resolve(res)
    }),(error:any)=>{
      reject(error)
    } // promisify... functions...
  })
  await value
  return value
  }
  async GetSubCategories(){
    let value = new Promise((resolve, reject) => {
      this.productService.getSubCategoriesList().subscribe((success)=>{
        this.subCategories = success
        resolve(success)
      }),(error:any)=>{
        reject(error)
      }
    })
    await value
    return value
    }
  GetCategoryName(id:any){
    return this.categories.find((item:any) => item.category_ID == id).name
  }
  GetSubCategoryName(id:any){
    return this.subCategories.find((item:any) => item.subCategory_ID == id).name
  }
  SetFileName(event:any){
this.fileName = event.target.files[0].name // see if need to check if file exists once you get file from event
console.log(this.fileName)
console.log(this.form.value)
//let image:any = this.form.get('image')?.setValue(this.fileName)
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
     this.uploadFile = reader.result
     
     // let val = (this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.setValue(false)
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
  }


createWriteOff(){
  //this.form.controls['image'].setValue(this.uploadFile)
  console.log(this.form.value)
let writeOff = new WriteOff();
writeOff.image = this.uploadFile
writeOff.quantity = this.form.controls['quantity'].value
writeOff.reason = this.form.controls['reason'].value
writeOff.product_ID = this.product.product_ID
writeOff.adjustment_ID = this.type



  this.writeoffservice.createWriteOff(writeOff).pipe(map(
    (res)=>{

console.log(this.type)


if(this.type == 1){
  this.ShowSnackBar("Product successfuly written off", "success");
}else{
  this.ShowSnackBar("Product successfuly written up", "success");
}

  }),catchError((err) =>{
    console.log(err)
    console.log(this.type)
  if(this.type == 1){
    this.ShowSnackBar("Failed to write off product", "error");
  }else{
    this.ShowSnackBar("Failed to write product up", "error");
  }
   
   return throwError(err)
  
  }
  )
  ).subscribe(res=>{
    console.log("success", res);
    //this.router.navigate(['/view-write-offs']);
    })
    // if(this.data.id == 1){
    //   this.data.quantity = this.data.quantity - this.form.controls['quantity'].value 
    // }else{
    //   this.data.quantity = this.data.quantity + this.form.controls['quantity'].value 
    // }
    // this.productService.updateProduct(this.product).subscribe(res=>{
    //   console.log("success", res);
    // })
   
}
private ShowSnackBar(message: string, panel: string){
  this._snackBar.open(message, "close", {
    duration: 2000,
    panelClass: [panel]
  })
}
  // putting this 



  







// async loadFiles(){

// this.images =[];

// const loading = await this.loadingCtrl.create({

//   message: 'loading data...',
// });
// //await loading.present();

// Filesystem.readdir({
//   directory: Directory.Data,
//   path: IMAGE_DIR
// }).then(result =>{
// console.log('here: ',result.files);
// this.loadFileData(result.files);
// //console.log('yess:',this.loadFileData(result.files));


// }, async () =>{
//   //console.log('err:', err)
//   await Filesystem.mkdir({
//     directory: Directory.Data,
//     path: IMAGE_DIR
  
//   });
//   }).then(_=>{
//     loading.dismiss();
//   })




// }


// async loadFileData(fileNames: any[]){

// for(let f of fileNames){
//   const filePath = `${IMAGE_DIR}/${f}`;


// const readFile = await Filesystem.readFile({
//   directory: Directory.Data,
//   path: filePath

// });
// console.log('READ: ', readFile);

// this.images.push({
//   name: f,
//   path: filePath,
//   data: `data:image/jpeg;base64,${readFile.data}`
// })


// }



// }


  async SelectImage(){
const image = await Camera.getPhoto({
quality:90,
allowEditing:false,

resultType: CameraResultType.Base64,
source:CameraSource.Photos
})
image.webPath
image.dataUrl
console.log(image);
//console.log(event.target.files[0]);



  }

//   async saveImage(photo:Photo){
// const base64Data = await this.readAsBase64(photo);
// console.log(base64Data)

//     const fileName = new Date().getTime() + '.jpeg';
//     const savedFile = await Filesystem.writeFile({
// directory: Directory.Data,
// path: `${IMAGE_DIR}/${fileName}`,
// data: base64Data

//     });
//     console.log('saved File: ', savedFile);
    
//     this.loadFiles();
//   }

//   private async readAsBase64(photo: Photo) {
//     // Fetch the photo, read as a blob, then convert to base64 format
//     const response = await fetch(photo.webPath!);
//     const blob = await response.blob();
  
//     return await this.convertBlobToBase64(blob) as string;
//   }

  
  
//   private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onerror = reject;
//     reader.onload = () => {
//         resolve(reader.result);
//     };
//     reader.readAsDataURL(blob);
//   });



}
