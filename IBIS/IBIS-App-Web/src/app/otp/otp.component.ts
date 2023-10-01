import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthGuardService } from '../Services/auth-guard.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { catchError, map, throwError } from 'rxjs';

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
  sent = false
  title1 = "A one-time-pin (OTP) has been sent to you."
  title2 = "Click to send One Time Pin"
  title:any = this.title2
  user:User = new User()
  previousUrl:any
  
  constructor(private loginservice: LoginService,private fb: FormBuilder, private router: Router,private toastController: ToastController
    ,private ActivatedRoute: ActivatedRoute,private _snackbar: MatSnackBar,private authGuardservice:AuthGuardService) { 
      this.authGuardservice.previousUrl.subscribe(previousUrl=>{
        this.previousUrl = previousUrl
        console.log(this.previousUrl)

    })
  }

  ngOnInit(): void {
console.log(this.ActivatedRoute.root)
console.log(this.router.url)
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
    this.GetUser()
    console.log("OTP method")
    this.loginservice.SendOTP(this.user.username).pipe(map(
      (res)=>{
        this.otp = res
    console.log(res)
    }),
    catchError((err) =>{
    {
        this.ShowSnackBar("failed to send otp", "error");
      }
      
      return throwError(err)
    })).subscribe((res)=>{
          console.log(res)
      this.ShowSnackBar("OTP sent successfully",'success');
     
        console.log(res)
        //this.presentToast('top')
        //alert(res.message)
        //this.otp = res
        this.title = this.title1
        //console.log(res['otpNumber'])
        //this.otp = res['otpNumber']
        //localStorage.setItem('OTP', res)
  })
}

  SubmitOTP(){
    console.log(this.otpForm.value)
    let otp = this.otpForm.controls['otp'].value
    if(otp==this.otp){
      
      console.log(this.user)
      if(this.previousUrl == "/Login"){
      this.loginservice.Authenticate(this.user).subscribe((res)=>{
       
          localStorage.setItem('Token', JSON.stringify(res))
          this.router.navigate(['/home'])
       
     
    })
      }else{
        this.loginservice.SetNewPassWord(this.user).pipe(map(
          (res)=>{
            
       
        }),
        catchError((err) =>{
        {
          this.ShowSnackBar("failed to update password", "error");
          }
          
          return throwError(err)
        })).subscribe((res)=>{
          this.ShowSnackBar("password successfully updated", "success");
          this.router.navigate(['/Login'])
        }), (error:any) => {
          
        }
      }
  }
    else{
      this.ShowSnackBar('OTP entered is incorrect', 'error')
    }
  }
async GetUser(){
  let value = new Promise((resolve,reject)=>{
  this.loginservice.user.subscribe((res:any)=>{
    console.log(res)
    this.user = res
  })
  
  })
  await value
}
  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "close", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }
  SubmitAndSetTimer(){
    console.log(localStorage.getItem('Token'))
    let otp = this.otpForm.controls['otp'].value
    if(otp==this.otp){
      this.router.navigate(['/timer',this.username]);
    }else{
      
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
