import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerform! : FormGroup

  constructor(private register: LoginService, private fb: FormBuilder,private router:Router) { }

  ngOnInit(): void {

this.registerform = this.fb.group({

  username : ['', Validators.required],
  password : ['', Validators.required],
  fullName : ['', Validators.required],
  email: ['',Validators.email]
  // surname : ['', Validators.required],
  // address : ['', Validators.required],
  // Cellphone_Number : ['', Validators.required]
})


  }


  onRegister(){
    this.register.Register(this.registerform.value).subscribe(
       (res)=>{
        alert(res.message)
        this.registerform.reset();
        this.router.navigate(['Login'])
       },
      (err) =>{
        alert(err?.error.message)
      }
    )}
  }

  


