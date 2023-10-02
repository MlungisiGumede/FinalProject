import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { User } from '../Models/User';
import { FileUpload } from '../Models/FileUpload';
import { environment } from 'src/environments/environment';
import { Customer } from '../Models/Customer';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.apiUrl + 'User';
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient
   }

  
public getUsersList(): Observable<User[]> {
  return this.httpClient.get<User[]>(this.apiUrl)
}
public getAuditTrail(){
  return this.httpClient.get<any>(`${this.apiUrl}/getAuditTrail`)
}
public UploadFile(file: any){
  return this.httpClient.post<FileUpload>(`${this.apiUrl}/fileUpload`,file)
}
public GetFiles(){
  return this.httpClient.get<FileUpload[]>(`${this.apiUrl}/getFile`)
}
public UploadProfile(file: any){
  return this.httpClient.post<User>(`${this.apiUrl}/uploadProfile`,file)
}
DeleteCustomer(id: any): Observable<any> {
  console.log(id)
   return this.httpClient.delete<any>(`${this.apiUrl}/DeleteCustomer/${id}` , )
     .pipe(
       
     );
 }

}
