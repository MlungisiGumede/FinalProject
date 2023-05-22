import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { User } from '../Models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
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
  constructor(private loginservice: LoginService,private fb: FormBuilder, private router: Router) {


    loginservice = {} as LoginService;
    this.data = [];


   }

  ngOnInit(): void{

this.loginForm = this.fb.group({

  username : ['', Validators.required],
  password : ['', Validators.required]
})


  }

  onlogin(){
if(this.loginForm.valid){
    this.loginservice.login(this.loginForm.value).subscribe({
      next: (res)=>{
        alert(res.message)
        this.loginForm.reset();
        this.router.navigate(['home'])
      },
      error:(err) =>{
        alert(err?.error.message)
      }
    })
  }
    
  }


  getUsers(){
    this.loginservice.getUserList().subscribe(response => {
      console.log(response);
      this.data = response;
      console.log("method 2", this.data)
    });

  }



}
