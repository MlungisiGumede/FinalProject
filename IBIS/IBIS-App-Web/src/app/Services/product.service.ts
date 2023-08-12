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
        return this.httpClient.post(this.apiUrl, prod, this.httpOptions)
      }
  
    
    
       getProductList(): Observable<Product> {
         return this.httpClient
         .get<Product>(this.apiUrl + '/getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getprod(id: any): Observable<Product> {
         return this.httpClient
           .get<Product>(this.apiUrl + "/" +id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       updateProduct(id: any, data: any): Observable<Product> {
         return this.httpClient
           .put<Product>(this.apiUrl + '/' + id, data, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       delete(id:number){
        return this.httpClient.delete<Product>(`${this.apiUrl}/${id}` , this.httpOptions);
     }



    
       deleteProduct(id: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${id}` , this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }
     }





  

