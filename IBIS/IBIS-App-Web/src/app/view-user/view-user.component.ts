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
title:any
// dropDown:any = [
//   {
//     permission_ID:true,
//     name:"true"
//   },
//   {
//     permission_ID:false,
//     name:"false"
//   }
// ]
guestDropDown:any = [
  {
    permission_ID:1,
    name:"Pay"
  },
  {
    permission_ID:2,
    name:"Review"
  }
]
employeeDropDown:any = [
  {
    permission_ID:3,
    name:"Customer Orders"
  },
  {
    permission_ID:4,
    name:"Supplier Orders"
  },
  {
    permission_ID:5,
    name:"Control Users"
  },
  {
    permission_ID:6,
    name:"Audit Trail"
  }, {
    permission_ID:7,
    name:"Adjust Stock"
  },
  // {
  //   permission_ID:8,
  //   name:"Control Users"
  // }
]
dropDown:any
  ngOnInit(): void {
    this.isDisabled = this.item.disable // maybe change the name of the key...
    if(this.isDisabled){
this.title = "Select Permissions"
    }else{
      this.title = "View User"
    }
    console.log(this.isDisabled)
    this.getUsers()
    this.form = new FormGroup({
      userName : new FormControl(this.item.user.userName, Validators.required),
      role : new FormControl(this.item.user.role, Validators.required),
      email : new FormControl(this.item.user.email, Validators.required),
      permissions : new FormControl(this.item.user.permissions,Validators.required)
    })
    if(this.item.user.role == "guest"){
      this.dropDown = this.guestDropDown
    }else{
      this.dropDown = this.employeeDropDown
    }
  }

  getUsers(): any{
  


    
}


update(){
  this.form.get('permissions')?.setValue("")
  this.loginService.UpdateUserRole(this.form.value).subscribe(res =>{

  })

}
OnSelect(e:any){
  console.log(e.value)
  let value = this.dropDown[this.form.get('permissions')?.value]
  // get all permission ids from the form control and push to list... array given by thingy...
  console.log(value)
}
Submit(){
  
  if(this.item.user.role == "employee"){
    this.form.get('permissions')?.setValue(this.employeeDropDown)
  }
  let arr:any[] = this.form.get('permissions')?.value
  let submitArr:any = []
  arr.forEach((item:any) => {
     let index = this.dropDown.findIndex((element:any) => element.permission_ID == item) 
     submitArr.push(this.dropDown[index]) 
  })
  this.form.get('permissions')?.setValue("")
  this.form.get('permissions')?.setValue(submitArr)
  console.log(submitArr)
  this.loginService.UpdateUserRole(this.form.value).subscribe(res =>{

  })

}

}
