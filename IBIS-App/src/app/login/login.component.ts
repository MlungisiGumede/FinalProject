import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { User } from '../Models/User';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  data: any;
  users : User[]=[];
  username ="";
  constructor(private loginservice: LoginService) {


    loginservice = {} as LoginService;
    this.data = [];


   }

  ngOnInit(){
this.getUsers();
this.loginservice.getUserList().subscribe((result: User[])=>(this.users = result));
console.log("data",this.users)


  }


  getUsers(){
    this.loginservice.getUserList().subscribe(response => {
      console.log(response);
      this.data = response;
      console.log("method 2", this.data)
    });

  }



}
