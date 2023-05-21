import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  constructor(private UserService: UserService) { }
data:any
  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(): any{
    this.UserService.getUsersList().subscribe((result: User[])=>(this.data = result));
    console.log("data",this.data)
    };

}
