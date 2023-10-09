import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from '../Services/user.service';
import { FileUpload } from '../Models/FileUpload';
import { QrScannerComponent } from 'angular2-qrscanner/qr-scanner.component';
import { async, map } from 'rxjs';
import { AuthGuardService } from '../Services/auth-guard.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ProfileHelpComponent } from '../profile-help/profile-help.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
dataLoaded:any = false
  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Upload File',
      subHeader: this.fileUpload.name,
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this.PostFile();
            // Add the function for uploading business brochure here
            //this.UploadBusinessBrochure();
          }
        },
       
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
  
    await actionSheet.present();
  }

uploadFile:any
request:any
url:any = ""
fileName:any
role:any
fileUpload = new FileUpload();
files:any = []
filedisplay:any
src:any = "../../assets/butchery.jpg" // or whatever then do the api call...
  constructor(public userService: UserService,public authGuardService: AuthGuardService,public helpModal: ModalController,
    private actionSheetCtrl: ActionSheetController) { }

  ngOnInit(): void {
    this.GetFiles()
   this.authGuardService.profileRole.subscribe((role:any) => {
     this.role = role
     console.log(this.role)
   })
  }
  UploadFile() {
    
  }
  GetFiles(){
    this.userService.GetFiles().subscribe(res=>{
      this.files = res
      console.log(res)
      this.dataLoaded = true
      if(res[0]){
        this.src = res[0].base64
        this.url = res[0].base64
        //this.src = res[0].base64
        console.log(res[0].base64)
       
        //this.src = res[0].base64
      }
      // this.url = res[0].base64
      // this.files.push(res[0]) // or this.files = res
      // this.files.push(res[1]) // or this.files = res
     //this.url = btoa(res.base64)
    }),(err:any) =>{
this.dataLoaded = true
    }
  }
  Download() {
    // https://stackoverflow.com/questions/68255538/angular-download-base64-file-data
    this.userService.GetFiles().subscribe(res=>{
      if(res[1]){
        //this.src = res[0].base64
   const src = res[1].base64;
      //this.url = src
      console.log(res)
      console.log(src)
      const link = document.createElement("a")
      link.href = src
      link.download = res[1].name
      link.click()
      
      link.remove()
      }
     
    })
   
  }
  OnResult(event:any){
console.log(event)
  }
  CheckImage(){
    if(this.fileName){
      if(this.fileName.endsWith('.png') || this.fileName.endsWith('.jpg') || this.fileName.endsWith('.jpeg')){
        return true
      }
    }
  
      return false
    
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: ProfileHelpComponent});
      return await modal.present();
  }
  CheckPdf(){
    if(this.fileName){
      if(this.fileName.endsWith('.pdf')){
        return true
      }
     
    }
    return false
  }
  FileChoice(e:any,request:any){
    let file = e.target.files[0];
    console.log(file)
    let reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => {
     //me.modelvalue = reader.result;
     console.log(reader.result);
     //alert("hi")
     this.uploadFile = reader.result
     this.fileName = e.target.files[0].name // see if need to check if file exists once you get file from event
     console.log(this.fileName)
     this.request = request
     this.fileUpload.base64 = this.uploadFile
     this.fileUpload.name = this.fileName
     this.fileName = ""
     //this.fileName = undefined
          this.request = request
   this.presentActionSheet()
     
   
      
     // let val = (this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.setValue(false)
   };
   reader.onerror = function (error) {
    alert(error);
     console.log('Error: ', error);
   };
  }
  PostFile() {
    this.fileUpload.type = this.request
    this.request = undefined
    this.fileName = undefined
    this.userService.UploadFile(this.fileUpload).subscribe(res=>{
      this.GetFiles()
       if(this.fileUpload.type == 1){
         this.url = res.base64
         
       }
    })
  }
  // UploadProfile(){
  //   this.fileUpload.type = 2
  //   this.userService.UploadFile(this.fileUpload).subscribe(res=>{
  //     this.url = res
  //     this.userService.GetFile().subscribe(res=>{
  //       console.log(res)
  //       if(res){
  //         this.url = res.base64
  //       }
  //     })
  //   })
  // }
  SetFileName(event:any){
    this.fileName = event.target.files[0].name // see if need to check if file exists once you get file from event
    console.log(this.fileName)
    //console.log(this.form.value)
    //let image:any = this.form.get('image')?.setValue(this.fileName)
      }
      // ngAfterViewInit() {
      //   this.qrScannerComponent.qrResult.subscribe((result: string) => {
          
      //   })
      //   this.qrScannerComponent.capturedQr.subscribe((result:any) => {
          
      //     console.log(result);
      //     });
      // }

}


