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
  name : ['', Validators.required],
  surname : ['', Validators.required],
  address : ['', Validators.required],
  Cellphone_Number : ['', Validators.required]
})


  }


  onRegister(){
    if(this.registerform.valid){
    this.register.Register(this.registerform.value).subscribe({
      next: (res)=>{
        alert(res.message)
        this.registerform.reset();
        this.router.navigate(['Login'])
      },
      error:(err) =>{
        alert(err?.error.message)
      }
    })
  }

  }

}
