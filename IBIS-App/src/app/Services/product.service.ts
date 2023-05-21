import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Product } from '../Models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = 'https://localhost:7226/api/Products';

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
     'Content-Type': 'application/json'
     })
      }



      private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        return throwError('Something bad happened; please try again later.'); 
      }
      
      
      
      
       createProduct(prod: Product){
        return this.httpClient.post(this.apiUrl + '/createsup' , prod, this.httpOptions)
      }
  
    
    
       getProductList(): Observable<Product> {
         return this.httpClient
         .get<Product>(this.apiUrl + '/getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getSup(id: string): Observable<Product> {
         return this.httpClient
           .get<Product>(this.apiUrl + '/api/supplier/id?id=' + id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       updateSupplier(id: string, item: any): Observable<Product> {
         return this.httpClient
           .put<Product>(this.apiUrl + '/PutProduct' + id, item, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
    
       deleteProduct(id: any): Observable<{}> {
         return this.httpClient.delete(this.apiUrl  + '/' + id , this.httpOptions)
           .pipe(
             catchError(this.handleError)
           );
       }
     }





  

