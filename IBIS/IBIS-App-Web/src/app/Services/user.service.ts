import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/User';
import { FileUpload } from '../Models/FileUpload';
import { environment } from 'src/environments/environment';


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
public UploadFile(file: any){
  return this.httpClient.post<FileUpload>(`${this.apiUrl}/fileUpload`,file)
}
public GetFiles(){
  return this.httpClient.get<FileUpload[]>(`${this.apiUrl}/getFile`)
}
public UploadProfile(file: any){
  return this.httpClient.post<User>(`${this.apiUrl}/uploadProfile`,file)
}
}
