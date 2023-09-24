import { Component, OnInit,Inject } from '@angular/core';
import { User } from '../Models/User';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserVM } from '../Models/UserVM';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  constructor(private UserService: UserService, public router: Router,
    @Inject(MAT_DIALOG_DATA) public item: any,private matDialogRef:MatDialogRef<ViewUserComponent>
    ,private loginService:LoginService) { }
data:any
form:any
isDisabled:any
dropDown:any = [
  {
    permission_ID:true,
    name:"true"
  },
  {
    permission_ID:false,
    name:"false"
  }
]
  ngOnInit(): void {
    this.isDisabled = this.item.disable // maybe change the name of the key...
    console.log(this.isDisabled)
    this.getUsers()
    this.form = new FormGroup({
      userName : new FormControl(this.item.user.userName, Validators.required),
      role : new FormControl(this.item.user.role, Validators.required),
      email : new FormControl(this.item.user.email, Validators.required),
      permissions : new FormControl(this.item.user.permissions,Validators.required)
    })
  }

  getUsers(): any{
  


    
}


update(){

  this.loginService.UpdateUserRole(this.form.value).subscribe(res =>{

  })

}

}
