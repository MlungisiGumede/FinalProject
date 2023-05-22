import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Supplier } from '../Models/Supplier';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {


  apiUrl = 'https://localhost:7226/api/Suppliers/';


  

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
      
      
      
      
       createSupplier(sup: Supplier){
        return this.httpClient.post(this.apiUrl , sup, this.httpOptions)
      }
  
    
    
       getSupplierList(): Observable<Supplier> {
         return this.httpClient
         .get<Supplier>(this.apiUrl + 'getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getSup(id: any): Observable<Supplier> {
         return this.httpClient
           .get<Supplier>(this.apiUrl  + id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       updateSupplier(id: any, data: any): Observable<Supplier> {
         return this.httpClient
           .put<Supplier>(this.apiUrl + id, data, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
    
       deleteSupplier(id: string): Observable<any> {
         return this.httpClient.delete(`${this.apiUrl}/${id}` , this.httpOptions)
           .pipe(
             catchError(this.handleError)
           );
       }
     }



