import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _router:Router,private loginService:LoginService,private authenticationService:AuthenticationService) { }

   canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
console.log(route.routeConfig?.path)
return new Promise((resolve, reject) => {
  let path = route.routeConfig?.path;
  if(path=="Login" || path==""){ // only login when otp complete.
    this.authenticationService.Authenticate().then((success) => {
     console.log("Login Authenticate success")
     if(localStorage.getItem('OTP') == 'null' || localStorage.getItem('OTP') == null){
       this._router.navigate(['/otp'])
       
      // check OTP token... then for other routes check OTP token... when deny if OTP token remove.
   }
   
   this._router.navigate(['/home'])
   resolve(false)
 }, (error) => {
   
   // http interceptor sends back to log in
    console.log("should come here")
    resolve(true)
     // just reject in promise method...
   }
      
   )}else{
     this.authenticationService.Authenticate().then((success) => {
       
       if(localStorage.getItem('OTP') == 'null' || localStorage.getItem('OTP') == null){
         this._router.navigate(['/otp'])
        // check OTP token... then for other routes check OTP token... when deny if OTP token remove.
        
     }
     resolve(true)
     }, (error) => {
      
      this._router.navigate(['/Login'])
      resolve(false)
     }
    
        
    )
   }
   if(path=="otp"){
    
    this.authenticationService.Authenticate().then((success) => {
      console.log(localStorage.getItem('OTP'))
      if(localStorage.getItem('OTP') == 'null' || localStorage.getItem('OTP') == null){
        resolve(true)
       // check OTP token... then for other routes check OTP token... when deny if OTP token remove.
       
    }else{
      this._router.navigateByUrl('/home').then(() => {
        resolve(false)
      })
      
     
    }
   
    }, (error) => {
      console.log("why though")
     this._router.navigate(['/Login'])
  // interceptor returns to login.
  resolve(false)
    }
       
    )
}
  })
   }

  }

  
     
      // check OTP token... then for other routes check OTP token... when deny if OTP token remove.
