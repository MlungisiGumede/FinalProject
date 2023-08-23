import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  constructor(private UserService: UserService, public router: Router) { }
data:any
  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(): any{
  


    
}


update(){

  this.router.navigate(['onetimepin']);

}

}
