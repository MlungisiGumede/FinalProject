import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {tap,catchError} from 'rxjs/operators';
import { Router } from '@angular/router';
import {Observable,throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
      //localStorage.getItem('Token') && localStorage.getItem('Token') != null
      let h1 = ""
      let h12 = "a"
      console.log(localStorage.getItem('Token') && localStorage.getItem('Token'))
      console.log(localStorage.getItem('Token'))
      //let var = localStorage.getItem('Token')
if (localStorage.getItem('Token') != 'null' && localStorage.getItem('Token') != null) {
  console.log(localStorage.getItem('Token'))
  const jwt = JSON.parse(localStorage.getItem('Token')!) //console.log(jwt)
 const token = jwt.token

  const cloned = req.clone({
      // headers: req.headers.set(
      //     "Bearer " + token,"cache-control:"+ "no-cache")
     headers: req.headers.set("Authorization","Bearer " + token)
.set('Cache-Control', 'no-cache').set('responseType', 'blob')
      //headers: new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json', 'Cache-Control': 'no-cache'  });
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
           .pipe(
                 catchError((error: HttpErrorResponse) => {
                  console.log(error)
                    if (error.status==401) {
                      this.router.navigate(['/login'])
                    }
                    return throwError(error);
                  } // else navigate to dashboard or whatever then you need to clear local storage before the test
                 
                 )
                
                 )
           
 
}
    }
    constructor(private router: Router) {
      
    }
  }
