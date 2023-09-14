import { Component, OnInit } from '@angular/core';
import { UserService } from '../Services/user.service';
import { FileUpload } from '../Models/FileUpload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
uploadFile:any
url:any
fileName:any
fileUpload = new FileUpload();
  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }
  UploadFile() {
    
  }
  Download() {
    // https://stackoverflow.com/questions/68255538/angular-download-base64-file-data
    this.userService.GetFile().subscribe(res=>{
      const src = res.base64;
      const link = document.createElement("a")
      link.href = src
      link.download = res.name
      link.click()
      
      link.remove()
    })
   
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
     this.fileName = e.target.files[0].name // see if need to check if file exists once you get file from event
     console.log(this.fileName)
     
     this.fileUpload.base64 = this.uploadFile
     this.fileUpload.name = this.fileName

   
     
   
      
     // let val = (this.form.get('records') as FormArray).controls[rowIndex].get('isDone')?.setValue(false)
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
  }
  PostFile() {
    this.userService.UploadFile(this.fileUpload).subscribe(res=>{
       
    })
  }
  SetFileName(event:any){
    this.fileName = event.target.files[0].name // see if need to check if file exists once you get file from event
    console.log(this.fileName)
    //console.log(this.form.value)
    //let image:any = this.form.get('image')?.setValue(this.fileName)
      }

}
