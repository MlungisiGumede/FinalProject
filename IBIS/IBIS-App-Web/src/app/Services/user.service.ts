import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/User';
import { FileUpload } from '../Models/FileUpload';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'https://localhost:7226/api/User';
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient
   }

  
public getUsersList(): Observable<User[]> {
  return this.httpClient.get<User[]>(this.apiUrl)
}
public UploadFile(file: any){
  return this.httpClient.post<User>(`${this.apiUrl}/fileUpload`,file)
}
public GetFile(){
  return this.httpClient.get<FileUpload>(`${this.apiUrl}/getFile`)
}
}
