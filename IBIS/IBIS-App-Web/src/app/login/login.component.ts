import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { User } from '../Models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import {ModalController,ToastController } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelpFunctionComponent } from '../help-function/help-function.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  data: any;
  users : User[]=[];
  name ="";
  loginForm!: FormGroup;
  
  constructor(private loginservice: LoginService,private fb: FormBuilder, private router: Router,
    private toastController: ToastController, public helpModal: ModalController,
    private _snackbar: MatSnackBar) {


    loginservice = {} as LoginService;
    this.data = [];

    console.log(localStorage.getItem('Token')!)
   }

  ngOnInit(): void{
    // this.loginservice.GetWeatherForeCast().subscribe(data => console.log(data));
this.loginForm = this.fb.group({

  username : ['', Validators.required],
  password : ['', Validators.required]
})
this.loginservice.setlogin(true)
  }

  onlogin(){
let val = this.loginForm.value
console.log(val)
  //this.presentToast('top')
  let user = new User()
  user.username = this.loginForm.controls['username'].value
  user.password = this.loginForm.controls['password'].value
  let username = this.loginForm.controls['username'].value
  //user.password = this.loginForm.controls['password'].value
  
    this.loginservice.login(user).subscribe({
      next: (res)=>{
        console.log(this.name)
        console.log(res)
        if(res.roleName == "guest"){
          this.loginservice.Authenticate(user).subscribe( (res=>{
            console.log(res.token)
            // did it the other way to access the user from Json object or why did he put user with the token...
            localStorage.setItem('Token',JSON.stringify(res))
            this.router.navigate(['/customer-view'])
          })
            
          )
        }else{
          this.router.navigate(['/otp'])
        }
        this.ShowSnackBar('Successfully Logged in', 'success')
        this.loginservice.user.next(user);
        
       
      },
      error:(err:any) =>{
        
        //alert(err?.error.message)
        console.log(err)
        this.ShowSnackBar("Login failed", 'error')
        //this.loginForm.reset();
      }
    })
  


 
  
    
  }


  async showHelp(){
    const modal = await this.helpModal.create({
      component: HelpFunctionComponent});
      return await modal.present();
  }

  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "close", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }



  getUsers(){
    this.loginservice.getUserList().subscribe(response => {
      console.log(response);
      this.data = response;
      console.log("method 2", this.data)
    });

  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Login Successfull',
      duration: 3000,
      position: position,
      color: 'success'
    });

    await toast.present();
  }

  async presentUnsuccessfulToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Login failed, try again',
      duration: 3000,
      position: position,
      //color: 'danger'
    });

    await toast.present();
  }



}
