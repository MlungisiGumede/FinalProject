import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { User } from '../Models/User';
import { AuthGuardService } from '../Services/auth-guard.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private router: Router,private authGuardService:AuthGuardService,
    private _snackbar:MatSnackBar) { }

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
        this.ShowSnackBar("log in timer set","success")
        this.authGuardService.previousUrl.subscribe(res =>{
          //let route:string = res
          console.log(res)
          this.router.navigate([res])
        })
        
      }else{
        this.authGuardService.previousUrl.subscribe(res =>{
          //let route:string = res
          console.log(res)
          this.router.navigate([res])
        })
      }
      
    })
    // skip button as well...
    //localStorage.setItem('OTP', this.otp)
    console.log(localStorage.getItem('Token'))
  }
  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }


}
