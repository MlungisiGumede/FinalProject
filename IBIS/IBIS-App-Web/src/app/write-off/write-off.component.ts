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
import { every } from 'rxjs';



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

  

  constructor(private route : ActivatedRoute,private prod: ProductService,private fb : FormBuilder, private loadingCtrl: LoadingController,private writeoffservice: WriteOffService
    ,private router: Router) {
      this.form= this.fb.group({
        product_ID : ['', Validators.required],
          reason : ['', Validators.required],
         image: ['', Validators.required],
          quantity : ['', Validators.required],
        })
    
    this.datawr = new WriteOff();
  }


  

  ngOnInit(): void {
    
    this.id = this.route.snapshot.params['id']


   

    this.id = this.route.snapshot.params['id']

    this.prod.getprod(this.id).subscribe((res)=>{
// subscribe maybe be problem
      this.data = res
      //res = this.viewproductform.value
      
      console.log('Product loaded:', this.data)
   
      });



//this.loadFiles();
  }
  SetFileName(event:any){
this.fileName = event.target.files[0].name // see if need to check if file exists once you get file from event
console.log(this.fileName)
console.log(this.form.value)
  }
  FileChoice(e:any){
    let file = e.target.files[0];
    console.log(file)
    let reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => {
     //me.modelvalue = reader.result;
     console.log(reader.result);
     this.uploadFile = reader.result
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
writeOff.product_ID = this.id

  this.writeoffservice.createWriteOff(writeOff).subscribe(res=>{
    console.log("success", res);
    this.router.navigate(['/view-write-offs',this.id]);
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
