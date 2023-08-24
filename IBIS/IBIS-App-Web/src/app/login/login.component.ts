import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { User } from '../Models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
  
  constructor(private loginservice: LoginService,private fb: FormBuilder, private router: Router,private toastController: ToastController) {


    loginservice = {} as LoginService;
    this.data = [];

    console.log(localStorage.getItem('Token')!)
   }

  ngOnInit(): void{
    

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
  let username = this.loginForm.controls['username'].value
  console.log(username)
    this.loginservice.login(val).subscribe({
      next: (res)=>{
        //this.presentToast('top')
        //alert(res.message)
        console.log(res)
        localStorage.setItem('Token', JSON.stringify(res))

        console.log(localStorage.getItem('Token'))
       
       
        //this.loginForm.reset();
       
        console.log(this.name)
        this.router.navigate(['/otp',username]);
      },
      error:(err) =>{
        
        //alert(err?.error.message)
        console.log(err)
        this.presentUnsuccessfulToast('top')
        this.loginForm.reset();
      }
    })
  


  if(this.loginForm.invalid){
    this.presentUnsuccessfulToast('top')
    
  }
  this.loginForm.reset();
    
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
