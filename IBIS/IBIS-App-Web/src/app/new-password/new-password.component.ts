import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
form:any
  constructor(private router: Router,private loginService:LoginService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
     
      username: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
    })
}

  



setnewpassword(){
  this.loginService.user.next(this.form.value)
  this.router.navigate(['/otp']);
  
}




}
