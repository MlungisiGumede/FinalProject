import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/User';


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
}
