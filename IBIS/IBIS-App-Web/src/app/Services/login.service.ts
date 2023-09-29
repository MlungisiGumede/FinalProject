import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpInterceptor} from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { User } from '../Models/User';
import { environment } from 'src/environments/environment';
import { UserVM } from '../Models/UserVM';
import { Customer } from '../Models/Customer';

@Injectable({
  providedIn: 'root'
})
export class LoginService  {

  private loginstate: BehaviorSubject<boolean>;
   public user:any = new BehaviorSubject<any>(null)


//const headers


  apiUrl = environment.apiUrl + 'User/';

  constructor(private httpClient: HttpClient) { 
    this.loginstate = new BehaviorSubject<boolean>(false);
  }
  public SetNewPassWord(user:User){
    return this.httpClient.post<User>(`${this.apiUrl}setNewPassWord`,user)
  }
  getAllUsers(){
    return this.httpClient.get<UserVM[]>(`${this.apiUrl}getAllUsers`)
  }
  AddEvent(event:any){
    return this.httpClient.post<any>(`${this.apiUrl}AddEvent`,event)
  }
  GetEvents(){
    return this.httpClient.get<any>(`${this.apiUrl}GetEvents`)
  }
  // GetWeatherForeCast(){
   
  //   return this.httpClient.get(`https://inf370team62023.azurewebsites.net/WeatherForeCast`);
  // }
public GetUserRole(){
  return this.httpClient.get<any>(`${this.apiUrl}getUserRole`)
}
public UpdateUserRole(userVM:UserVM){
  return this.httpClient.post<any>(`${this.apiUrl}updateUserRole`,userVM)
}
public getCustomerOrders(){
  return this.httpClient.get<any>(`${this.apiUrl}getCustomerOrders`)
}
public AddUser(user:UserVM){
  return this.httpClient.post<any>(`${this.apiUrl}AddUser`,user)
}
DeleteCustomer(id: any): Observable<any> {
  console.log(id)
   return this.httpClient.delete<any>(`${this.apiUrl}/${id}` , )
     .pipe(
       
     );
 }
 DeleteUser(id:any): Observable<any> {
  return this.httpClient.delete<any>(`${this.apiUrl}DeleteUser/${id}` , )
     .pipe(
       
     );
 }
 DeleteEmployee(id:any): Observable<any> {
  return this.httpClient.delete<any>(`${this.apiUrl}/DeleteEmployee/${id}` , )
     .pipe(
       
     );
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
    public AuthenticateManager(user:any):Observable<any>{
      console.log(user)
      return this.httpClient.post<any>(`${this.apiUrl}AuthenticateAdmin`,user)
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







  
  
    
   

        