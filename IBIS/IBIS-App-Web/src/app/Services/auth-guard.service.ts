import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ResolveStart, Router, RouterStateSnapshot } from '@angular/router';
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
      // check OTP token... then for other routes check OTP token... when deny if OTP token remove.
   this._router.navigate(['/home'])
   resolve(false)
 }, (error) => {
   
   // http interceptor sends back to log in
    console.log("should come here")
    resolve(true)
     // just reject in promise method...
   }
      
   )}   else if(path?.startsWith("otp") || path?.startsWith("timer") || path?.startsWith("write-off")){
    console.log(this._router.url) // when from Login then /Login when from url then just /    ...
    if(this._router.url=="/"){ // navigate fron elsewhere...
      this.authenticationService.Authenticate().then((success) => {
        this._router.navigate(['/home'])
        resolve(false)
         // check OTP token... then for other routes check OTP token... when deny if OTP token remove.
      }, (error) => {
        this._router.navigate(['/Login'])
        resolve(false)
      })
    }else{
      resolve(true)
    }    
    
}else{
  console.log("hitting home")
     this.authenticationService.Authenticate().then((success) => {
       
     
     resolve(true)
     }, (error) => {
      console.log(error)
      if(error.status==401){
        resolve(false)
        this._router.navigate(['/Login'])
      }else{
        resolve(true)
      }
      // taken out to demo errors
      //this._router.navigate(['/Login'])
      //resolve(false)
       // this needs to be there but if it fils
     }
    
        
    )
   }

  })
   }

  }

  
     
      // check OTP token... then for other routes check OTP token... when deny if OTP token remove.
