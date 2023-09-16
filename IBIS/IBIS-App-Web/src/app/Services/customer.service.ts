import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Supplier } from '../Models/Supplier';
import { Customer } from '../Models/Customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { 
    
  }

  
  apiUrl = environment.apiUrl+'Customers/';

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
      
      
      
      
       CreateCustomer(customer: Customer){
        return this.httpClient.post(this.apiUrl , customer, this.httpOptions)
      }
  
    
    
       getCustomerList(): Observable<Customer[]> {
         return this.httpClient
         .get<Customer[]>(this.apiUrl + 'getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getCustomer(id: any): Observable<Customer> {
         return this.httpClient
           .get<Customer>(this.apiUrl  + id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       UpdateCustomer(data: any): Observable<Customer> {
         return this.httpClient
           .put<Customer>(this.apiUrl + data.id, data, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }

    //    delete(id:number){
    //     return this.httpClient.delete<Supplier>(`${this.apiUrl}${id}` , this.httpOptions);
    //  }
      
    
       DeleteCustomer(id: any): Observable<any> {
        console.log(id)
         return this.httpClient.delete<Customer>(`${this.apiUrl}${id}` , this.httpOptions)
           .pipe(
             catchError(this.handleError)
           );
       }
     }

