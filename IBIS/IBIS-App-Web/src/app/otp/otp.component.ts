import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  data: any;
  users : User[]=[];
  otp :any;
  otpForm!: FormGroup;
  username:any
  user:User = new User()
  
  constructor(private loginservice: LoginService,private fb: FormBuilder, private router: Router,private toastController: ToastController
    ,private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.otpForm = this.fb.group({

      otp : ['', [Validators.required, this.otpValidator.bind(this)]]
      
    })
    this.ActivatedRoute.params.subscribe(params => {
      this.user.username = params['username']
      this.username = params['username']
     // this.user.password = params['user'].password
    
  })

  //console.log("after")
  
    // check on refresh...
  }

  otpValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && (isNaN(value) || value.toString().length !== 6)) {
      return { 'invalidOTP': true };
    }
    return null;
  }

  BackToLogin(){
    localStorage.removeItem('Token')
  this.router.navigate(['/Login'])
  }
  SendOTP(){
   
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
  
  SubmitOTP(){
    console.log(this.otpForm.value)
    let otp = this.otpForm.controls['otp'].value
    if(otp==this.otp){
      console.log(this.user)
      this.loginservice.Authenticate(this.user).subscribe((res)=>{
        console.log(res)
        localStorage.setItem('Token', JSON.stringify(res))
        this.router.navigate(['/home'])
      })
      //localStorage.setItem('OTP', this.otp)
      console.log(localStorage.getItem('Token'))
     
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
