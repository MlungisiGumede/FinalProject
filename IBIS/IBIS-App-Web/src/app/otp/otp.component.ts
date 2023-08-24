import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  data: any;
  users : User[]=[];
  otp :any;
  form!: FormGroup;
  username:any
  constructor(private loginservice: LoginService,private fb: FormBuilder, private router: Router,private toastController: ToastController
    ,private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.form = this.fb.group({

      otp : ['', Validators.required]
      
    })
    this.ActivatedRoute.params.subscribe(params => {
      this.username = params['username']
      console.log(params['username'])
      console.log(params['username'])
  })
  console.log(this.username)
  if(this.username==undefined){
    this.BackToLogin()
  }
  //console.log("after")
  
    console.log(this.username) // check on refresh...
  }
  BackToLogin(){
    localStorage.removeItem('Token')
  this.router.navigate(['/Login'])
  }
  SendOTP(){
    if(this.username==undefined){
      this.BackToLogin()
      
    }else{
    console.log("OTP method")
    this.loginservice.SendOTP(this.username).subscribe((res)=>{
     
        console.log(res)
        //this.presentToast('top')
        //alert(res.message)
        this.otp = res
        //console.log(res['otpNumber'])
        //this.otp = res['otpNumber']
        //localStorage.setItem('OTP', res)
  })
,(err:any)=>{
  console.log("there is error")
}
  }
  }
  
  SubmitOTP(){
    console.log(this.form.value)
    let otp = this.form.controls['otp'].value
    if(otp==this.otp){
      localStorage.setItem('OTP', this.otp)
      console.log(localStorage.getItem('Token'))
      this.router.navigate(['/home'])
    }
    else{
      this.presentToast('top',"The OTP is Invalid",this.otp)
    }
    
     
   

  }
  async presentToast(position: 'top' | 'middle' | 'bottom',message:any,operation:any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: position,
      color: operation
    });
    await toast.present();
  }

}
