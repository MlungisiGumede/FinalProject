import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpInterceptor} from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService  {

  private loginstate: BehaviorSubject<boolean>;



//const headers


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
    public FindUser(username:any,password:any):Observable<any>{
      let user = new User() 
      user.username = username
      user.password = password
      return this.httpClient.post<any>(`${this.apiUrl}FindUser`,user)
    }
    public SendOTP(username:any):Observable<any>{
      let user = new User()
      user.username = username
      return this.httpClient.post<any>(`${this.apiUrl}SendOTP`,user)
    }
    public Authenticate(user:any):Observable<any>{
      console.log(user)
      return this.httpClient.post<any>(`${this.apiUrl}Authenticate`,user)
    }
    public GetAuthentication(){
      return this.httpClient.get<any>(`${this.apiUrl}GetAuthentication`)
    }

    login(loginObj: any){

      return this.httpClient.post<any>(`${this.apiUrl}Login`,loginObj)
    }

    Register(userObj: any){

return this.httpClient.post<any>(`${this.apiUrl}register`,userObj)
    }


    setlogin(newValue:boolean): void {
      this.loginstate.next(newValue);
    }

    getlogin(): Observable<boolean> {
      return this.loginstate.asObservable();
    }


  }







  
  
    
   

        