import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { User } from '../Models/User';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
options:any = [
  { id: 1, time: 'seconds' },
  { id: 2, time: 'minutes' },
  { id: 3, time: 'hours' },
]
user:any
username:any
form:any
  constructor(private ActivatedRoute: ActivatedRoute,private loginService:LoginService,
    private router: Router) { }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(params => {
      this.username = params['username']
    
  })
    this.form = new FormGroup({
      //unit: new FormControl('',[Validators.required]),
      time: new FormControl('',[Validators.required])

    })
  }
  Submit(){
    // value needing to enter. 0,01
  
    let myUser = new User()
    myUser.username = "u21482358"
    myUser.time = this.form.controls['time'].value
    console.log(myUser)
    
    this.loginService.AuthenticateManager(myUser).subscribe((res)=>{
      console.log(res)
      if(res){
        localStorage.setItem('Token', JSON.stringify(res))
        this.router.navigate(['/home'])
      }else{
        this.router.navigate(['/Login'])
      }
      
    })
    // skip button as well...
    //localStorage.setItem('OTP', this.otp)
    console.log(localStorage.getItem('Token'))
  }

}
