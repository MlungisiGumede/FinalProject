import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ViewUserComponent } from '../view-user/view-user.component';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit {
request:any
data:any = of([{}])
filterTerm!: string
  constructor(public matDialog:MatDialog,public logInService:LoginService) { }

  ngOnInit(): void {
    this.logInService.getAllUsers().subscribe(res=>{
      this.data = of(res)
      console.log(res)
    })
  }
  View(user:any){
   const dialogRef = this.matDialog.open(ViewUserComponent,{
    data:{'user':user,'disable':false}
   })
  }
  UpdateRole(user:any){
    const dialogRef = this.matDialog.open(ViewUserComponent,{
     data:{'user':user,'disable':true}
    })
   }

}
