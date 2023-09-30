import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ViewUserComponent } from '../view-user/view-user.component';
import { LoginService } from '../Services/login.service';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit {
request:any
data:any = of([{}])
filterTerm!: string
permissions:any
role:any
  constructor(public matDialog:MatDialog,public logInService:LoginService) { }

  ngOnInit(): void {
    this.logInService.getAllUsers().subscribe(res=>{
      this.data = of(res)
      this.GetUserRole()
      console.log(res)
    })
  }
  View(user:any){
   const dialogRef = this.matDialog.open(ViewUserComponent,{
    data:{'user':user,'disable':false}
   })
  }
  Add(){
    const dialogRef = this.matDialog.open(AddUserComponent,{
      
     })
  }
  DeleteUser(item:any){
  
    this.logInService.DeleteUser(item).subscribe(res=>{
      console.log(res)
    })
  
  }
  async GetUserRole(){
    let value = new Promise((resolve, reject) => {
      this.logInService.GetUserRole().subscribe((res) => {
        this.permissions = res.permissions
        this.role = res.role
        console.log(res)
       //alert(this.permissions)
        resolve(res)
      }), (error: any) => {
        reject(error)
      }
    })
    await value
    return value
  }
  CheckPermission(input:any){
   
      if(this.role == "manager"){
        
        return true
       }
    let index = this.permissions.findIndex((element:any) => element.permission_ID == input)
        console.log(index)
      if(index > -1){
        return true
      }else{
       
        return false
      }
   
    
}
  UpdateRole(user:any){
    const dialogRef = this.matDialog.open(ViewUserComponent,{
     data:{'user':user,'disable':true}
    })
   }

}
