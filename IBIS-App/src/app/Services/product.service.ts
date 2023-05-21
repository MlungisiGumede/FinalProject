import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = 'https://localhost:7226/api/User';
  constructor(private httpClient: HttpClient) { }


  public getProductsList(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.apiUrl)
  }

  
}
