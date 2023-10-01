import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, of, throwError } from 'rxjs';
import { ViewUserComponent } from '../view-user/view-user.component';
import { LoginService } from '../Services/login.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeHelpComponent } from '../home-help/home-help.component';
import { ModalController } from '@ionic/angular';

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
  constructor(public matDialog:MatDialog,public logInService:LoginService, public helpModal: ModalController,
    public router:Router,private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
   this.GetUsers()
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: HomeHelpComponent});
      return await modal.present();
  }
  View(user:any){
   const dialogRef = this.matDialog.open(ViewUserComponent,{
    data:{'user':user,'disable':false}
   })
   dialogRef.afterClosed().subscribe((res:any) => {
      
    if(res){
      this.GetUsers()
      this.ShowSnackBar("User Successfully Edited", "success");
    
    }else if(res == false){
      this.ShowSnackBar("Failed to Edit User", "error");
    }
  })
  }
  Add(){
    const dialogRef = this.matDialog.open(AddUserComponent,{
      
     })
     dialogRef.afterClosed().subscribe((res:any) => {
      
        if(res){
          this.GetUsers()
          this.ShowSnackBar("User Successfully Added", "success");
        
        }else if(res == false){
          this.ShowSnackBar("Failed to Add User", "error");
        }
      })
    }

    ShowSnackBar(message: string, panel: string) {
      this._snackbar.open(message, "close", {
        duration: 5000,
        panelClass: [panel]
        
      });
    }
     
  
  DeleteUser(item:any){
  
    this.logInService.DeleteUser(item).pipe(map(
      (res)=>{

    }),
    catchError((err) =>{
      console.log(err)
    
        this.ShowSnackBar("failed to remove user", "error");
      
      
      return throwError(err)
    })).subscribe(res=>{
      this.ShowSnackBar("user successfully removed", "success");
      this.GetUsers()
    })
  
  }
  GetUsers(){
    this.logInService.getAllUsers().subscribe(res=>{
      this.data = of(res)
      this.GetUserRole()
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
Navigate(){
  this.router.navigate(['/calendar'])
}
  UpdateRole(user:any){
    const dialogRef = this.matDialog.open(ViewUserComponent,{
     data:{'user':user,'disable':true}
    })
   }

}
