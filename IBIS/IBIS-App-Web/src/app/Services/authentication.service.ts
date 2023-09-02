import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {tap,catchError, map} from 'rxjs/operators';
import { Router } from '@angular/router';
import {Observable,throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements HttpInterceptor {
  apiUrl = 'https://localhost:7226/api/User/';
  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
      //localStorage.getItem('Token') && localStorage.getItem('Token') != null
      let h1 = ""
      let h12 = "a"
      //console.log("hi")
      //console.log(localStorage.getItem('Token'))
      //console.log(localStorage.getItem('Token'))
      //let var = localStorage.getItem('Token')
if (localStorage.getItem('Token') != 'null' && localStorage.getItem('Token') != null) {
  //console.log(localStorage.getItem('Token'))
  const jwt = JSON.parse(localStorage.getItem('Token')!) //console.log(jwt)
 const token = jwt.token

  const cloned = req.clone({
       headers:  req.headers.set("Authorization","Bearer " + token)
       .set('Cache-Control', 'no-cache').set('responseType', 'blob')
   
  });

   return next.handle(cloned);
}
else {
  // return next.handle(req).subscribe(
  //   event => {
  //     if (event instanceof HttpResponse) {
  //       console.log('event--->>>', event);
  //     }
  //   },err => {
  //     if(err.status == 401){
  //       this.router.navigate(['/login'])
  //   }
  // }
  // )
   return next.handle(req)
  //          .pipe(
  //                catchError((error: HttpErrorResponse) => {
  //                 console.log(error)
  //                   if (error.status==401) {
  //                     console.log("401 error")
  //                     this.router.navigate(['/Login'])
  //                   }
  //                   return throwError(error);
  //                 } // else navigate to dashboard or whatever then you need to clear local storage before the test
                 
  //                )
                
  //                )
           
 
}
    
    }
    async Authenticate():Promise<any>{
      let bool = false
      let val = new Promise((resolve,reject) =>{
     let req =  this.httpClient.get(`${this.apiUrl}CheckAuthentication`,{observe: 'response'}).pipe(
        map((res) =>{
         
          //return resolve("success")
          resolve("success")
          bool=true
        }),
        catchError((err) =>{
          { // just check numbers of errors for client side and server side...
            //return reject("Client side error: Couldn't connect to server (API)") // check actual codes and maybe do this differently
             reject("Client side error: Couldn't connect to server (API)")
            bool=false
           // 
            
           }
            
            return throwError(err)
        }) // retry is working...
      ).subscribe()
      })
await val;

return val;
}
  
    constructor(private router: Router,private httpClient: HttpClient) {
      
    }
  }
