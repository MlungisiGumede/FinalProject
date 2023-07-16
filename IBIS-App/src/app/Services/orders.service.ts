import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Orders } from '../Models/Orders';

@Injectable({
  providedIn: 'root'
})

export class OrdersService {
  apiUrl = 'https://localhost:7226/api/Orders';

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
      
      
      
      
       createOrder(ord: Orders){
        return this.httpClient.post(this.apiUrl, ord, this.httpOptions)
      }
  
    
    
       getOrderList(): Observable<Orders> {
         return this.httpClient
         .get<Orders>(this.apiUrl + '/getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getord(id: any): Observable<Orders> {
         return this.httpClient
           .get<Orders>(this.apiUrl + "/" +id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       updateOrder(id: any, data: any): Observable<Orders> {
         return this.httpClient
           .put<Orders>(this.apiUrl + '/' + id, data, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       delete(id:number){
        return this.httpClient.delete<Orders>(`${this.apiUrl}/${id}` , this.httpOptions);
     }



    
       deleteOrder(id: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${id}` , this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }
}
