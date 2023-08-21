import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';
import { ProductService } from '../Services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera,CameraResultType,CameraSource,Photo } from '@capacitor/camera';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { WriteOffService } from '../Services/write-off.service';
import { writeOff } from '../Models/writeOff';



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

  newWriteOff!: writeOff;
  id: any;
  data:any;
  viewproductform!: FormGroup;
  pic: any;
  datawr:any;

  

  constructor(private route : ActivatedRoute,private prod: ProductService,private fb : FormBuilder, private loadingCtrl: LoadingController,private writeoffservice: WriteOffService) { 
    this.datawr = new writeOff();
  }


  

  ngOnInit(): void {
    
    this.id = this.route.snapshot.params['id']


    this.viewproductform = this.fb.group({

      product_Name : ['', Validators.required],
      category: ['', Validators.required],
      subcategory : ['', Validators.required],
      price : ['', Validators.required],
      phone : ['', Validators.required],
      quantity : ['', Validators.required],
      expiry :  ['', Validators.required]
    })

    this.id = this.route.snapshot.params['id']

    this.prod.getprod(this.id).subscribe((res)=>{

      this.data = res
      res = this.viewproductform.value
      
      console.log('Product loaded:', this.data)
      });

this.loadFiles();
  }


createWriteOff(){


  this.writeoffservice.createWriteOff(this.datawr).subscribe(res=>{
    console.log("success", res);
    })  



}




async loadFiles(){

this.images =[];

const loading = await this.loadingCtrl.create({

  message: 'loading data...',
});
//await loading.present();

Filesystem.readdir({
  directory: Directory.Data,
  path: IMAGE_DIR
}).then(result =>{
console.log('here: ',result.files);
this.loadFileData(result.files);
//console.log('yess:',this.loadFileData(result.files));


}, async () =>{
  //console.log('err:', err)
  await Filesystem.mkdir({
    directory: Directory.Data,
    path: IMAGE_DIR
  
  });
  }).then(_=>{
    loading.dismiss();
  })




}


async loadFileData(fileNames: any[]){

for(let f of fileNames){
  const filePath = `${IMAGE_DIR}/${f}`;


const readFile = await Filesystem.readFile({
  directory: Directory.Data,
  path: filePath

});
console.log('READ: ', readFile);

this.images.push({
  name: f,
  path: filePath,
  data: `data:image/jpeg;base64,${readFile.data}`
})


}



}


  async selectImage(){
const image = await Camera.getPhoto({
quality:90,
allowEditing:false,
resultType: CameraResultType.Uri,
source:CameraSource.Photos
})
console.log(image);

if(image){

this.saveImage(image);


}


  }

  async saveImage(photo:Photo){
const base64Data = await this.readAsBase64(photo);
console.log(base64Data)

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
directory: Directory.Data,
path: `${IMAGE_DIR}/${fileName}`,
data: base64Data

    });
    console.log('saved File: ', savedFile);
    
    this.loadFiles();
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });



}
