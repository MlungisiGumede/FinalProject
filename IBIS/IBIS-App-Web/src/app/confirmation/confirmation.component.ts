import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
token:any
user:any
title:any = "Awaiting Email Confirmation"
  constructor(private loginService: LoginService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.user = params['user']; // maybe in local storage later...like the jwt...
      console.log(this.token);
      console.log(this.user);
  });
  //localst
    // do the API call here...
    // this.loginService.ConfirmEmail().subscribe(
      let obj = {
        token: this.token,
        username: this.user
      }
      this.loginService.ConfirmEmail(obj).subscribe( ()=>{
        this.title = "User Successfully Registered"
      }
        
      )
    // )
  }

}
