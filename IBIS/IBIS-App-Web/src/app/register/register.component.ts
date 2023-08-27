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

  registerForm! : FormGroup

  constructor(private register: LoginService, private fb: FormBuilder,private router:Router) { }

  ngOnInit(): void {

this.registerForm = this.fb.group({

  username : ['', Validators.required],
  password : ['', Validators.required],
  fullName : ['', Validators.required],
  email: ['',Validators.email]
  // surname : ['', Validators.required],
  // address : ['', Validators.required],
  // Cellphone_Number : ['', Validators.required]
})


  }
BackToLogin(){
  console.log("BackToLogin")
  this.router.navigate(['/Login'])
}

  onRegister(){
    console.log("not supposed to happen")
    this.register.Register(this.registerForm.value).subscribe(
       (res)=>{

        //alert(res.message)
       
      this.router.navigate(['/Login'])
       },
      (err) =>{
        alert("Couldnt Register please try again")
      }
    )}
  }

  


