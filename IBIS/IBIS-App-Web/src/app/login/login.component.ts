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
  username ="";
  loginForm!: FormGroup;
  constructor(private loginservice: LoginService,private fb: FormBuilder, private router: Router,private toastController: ToastController) {


    loginservice = {} as LoginService;
    this.data = [];


   }

  ngOnInit(): void{

this.loginForm = this.fb.group({

  username : ['', Validators.required],
  password : ['', Validators.required]
})
this.loginservice.setlogin(true)
  }

  onlogin(){
if(this.loginForm.valid){
  this.presentToast('top')
    this.loginservice.login(this.loginForm.value).subscribe({
      next: (res)=>{
        //this.presentToast('top')
        //alert(res.message)
        this.loginservice.setlogin(true);
        this.loginForm.reset();
        this.router.navigate(['/home']);
      },
      error:(err) =>{
        //alert(err?.error.message)
        this.presentUnsuccessfulToast('top')
        this.loginForm.reset();
      }
    })
  }


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
      color: 'danger'
    });

    await toast.present();
  }



}
