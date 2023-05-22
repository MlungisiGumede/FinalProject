import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginstate: BehaviorSubject<boolean>;






  apiUrl = 'https://localhost:7226/api/User/';

  constructor(private httpClient: HttpClient) { 
    this.loginstate = new BehaviorSubject<boolean>(false);
  }

  

  httpOptions = {
    headers: new HttpHeaders({
     'Content-Type': 'application/json'
     })
      }
      
    public getUserList(): Observable<User[]> {
      return this.httpClient
        .get<User[]>(this.apiUrl)
    }

    login(loginObj: any){

      return this.httpClient.post<any>(`${this.apiUrl}authenticate`,loginObj)
    }

    Register(userObj: any){

return this.httpClient.post<any>(`${this.apiUrl}Register`,userObj)
    }


    setlogin(newValue:boolean): void {
      this.loginstate.next(newValue);
    }

    getlogin(): Observable<boolean> {
      return this.loginstate.asObservable();
    }


  }







  
  
    
   

        