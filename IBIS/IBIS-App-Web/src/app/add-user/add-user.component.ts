import { Component, OnInit } from '@angular/core';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../Services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
form:any
  constructor(private UserService: UserService, public router: Router,
    private matDialogRef:MatDialogRef<AddUserComponent>
    ,private loginService:LoginService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      fullName : new FormControl("", Validators.required),
      email : new FormControl("", [Validators.required,Validators.email]),
      phone : new FormControl("",Validators.required)
    })
  }
  AddUser(){
    this.loginService.AddUser(this.form.value).subscribe()
  }

}
