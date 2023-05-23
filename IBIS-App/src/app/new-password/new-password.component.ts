import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }



setnewpassword(){
  this.router.navigate(['/Login']);
}




}
