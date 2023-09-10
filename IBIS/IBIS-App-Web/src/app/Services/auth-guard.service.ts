import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ResolveStart, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { LoginService } from './login.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  public previousUrl:BehaviorSubject<string> = new BehaviorSubject<string>('');
  public showNavigation:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public showLogOut:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  LogInRequest:any
  path:any
  role:any
  constructor(private _router:Router,private loginService:LoginService,private authenticationService:AuthenticationService) { }

   canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      this.previousUrl = new BehaviorSubject(this._router.url)

console.log(route.routeConfig?.path)
return new Promise((resolve, reject) => {

  let path = route.routeConfig?.path;
  this.path = route.routeConfig?.path;
  this.ShowNavigation()
  // disabled routes method
 // could get user role here...
  this.authenticationService.Authenticate().then((success) => {
    console.log("success is here")
    console.log(success)
    this.GetUserRole().then((role) => {
      console.log(role)
      if(this.DisableRoutes(role)){ // disabled routes based on role
        console.log("disabled")
        resolve(false) // disabled before others...
      }
      if(this.LoginRequest(role,true)){ // navigated to log user in based on role
        console.log("log in request")
        resolve(false) // logged in and authenticated so disable
        
      }
    })
    console.log("reaching resolve")
    resolve(true) // because login disabled and other roles routes disabled
  }).catch((error:any) => {
    console.log(error)
    console.log("error is here")
    if(error.status==401){ 
      
      if(this.ValidRequest()){ // through code to OTP or Timer
        resolve(true)
        
      }
            resolve(false) // take this out later maybe
          
    }
           
            resolve(false)
  })
      
       
        }
)}
        
  ShowNavigation(){
    if(this.path=="Login" || this.path=="" || this.path=="otp" || this.path=="timer" || this.path=="customer-view"){
      this.showNavigation.next(false) // ugly way...
      this.showLogOut.next(false)
      console.log("hi")
    }else{
      this.showNavigation.next(true)
    }if(this.path == "customer-view"){
      this.showLogOut.next(true)
   
    

  }
}

   
   DisableRoutes(role:any){
    let disabled = false
    if(role == "guest"){
    if(this.path=="/view-customer" || this.path=="/Login" || this.path==""){
    }else{
      disabled = true
    }
  }else{
    if(this.path=="/view-customer"){
      disabled =  true
    }
  }
  console.log(disabled)
  return disabled
   }
   BanPreviousURL(path:any){
     if(path?.startsWith("otp") || path?.startsWith("timer") || path?.startsWith("write-off"))
       if(this._router.url=="/"){
        this._router.navigate(['/Login'])
        return true
       }
       return false
   }
   LoginRequest(role:any,authenticated:boolean){
    let path = this.path
    let logInRequest = false
    console.log(path)
    if(path == "Login" || path=="" ){ // navigate fron elsewhere...
      logInRequest = true
     if(authenticated){
      if(role == "guest"){
        this._router.navigate(['/customer-view'])
        
        return true
       }else{ // going through this logic...
        console.log("shouldnt be here")
        this._router.navigate(['/home'])
      
       logInRequest = false
        
      }
    }
  }
  return logInRequest
}  
ValidRequest(){
  let value = true
  if(this.path?.startsWith("otp") || this.path?.startsWith("timer")){
    if(this._router.url=="/"){
      this._router.navigate(['/Login'])
      value = false
    }
    console.log(this.path)
    if(this._router.url=="/Login" || this._router.url=="/"){
      console.log("in here")
      value = true
    }
   
  }
  return value
}
   async GetUserRole(){
    let value =  new Promise((resolve, reject) => {
    this.loginService.GetUserRole().subscribe((success)=>{
      resolve(success.roleName)
    }),(error:any)=>{
      reject(error)
    }
    
  })
  await value
  return value
   }
AuthenticateAdmin(path:any){
  return new Promise((resolve, reject) => {
    // whole otp thing in here...
  if(path?.startsWith("customer-view")){
    resolve(false)
  
    }else{
    console.log("hitting home")
       resolve(true)
       }
      })
    }
      
      
          
      
    

async Authenticate(path:any){ // sort all routes out for login and return authentication
  let authenticated:boolean = false
  let method = new Promise((resolve, reject) => {
     // only login when otp complete.
      this.authenticationService.Authenticate().then((success) => {
     //this._router.navigate(['/home']) check afterwards
     authenticated = true
     resolve(true)

   }, (error) => {
     
     // http interceptor sends back to log in
     if(error.status==401){
      reject(error)
      //this._router.navigate(['/Login'])
    }else{
      resolve(true)
    }
       // just reject in promise method...
     }
        
     )
 })
 await method
 return method
}
 

AuthenticateGuest(path:any){
  return new Promise((resolve, reject) => {
 
   if(path?.startsWith("customer-view")){
    resolve(true)
  
    }else{
      reject(false)
    }
  })
}
}


  
     
     
