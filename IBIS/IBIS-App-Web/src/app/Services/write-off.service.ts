import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Supplier } from '../Models/Supplier';
import { writeOff } from '../Models/writeOff';


@Injectable({
  providedIn: 'root'
})
export class WriteOffService {


  apiUrl = 'https://localhost:7226/api/writeOff/';


  

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
      
      
      
      
       createWriteOff(sup: writeOff){
        return this.httpClient.post(this.apiUrl , sup, this.httpOptions)
      }
  
    
    
       getWriteOffList(): Observable<writeOff> {
         return this.httpClient
         .get<writeOff>(this.apiUrl + 'getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getwriteOff(id: any): Observable<writeOff> {
         return this.httpClient
           .get<writeOff>(this.apiUrl  + id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       updateWriteOff(id: any, data: any): Observable<writeOff> {
         return this.httpClient
           .put<writeOff>(this.apiUrl + id, data, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }

       delete(id:number){
        return this.httpClient.delete<writeOff>(`${this.apiUrl}${id}` , this.httpOptions);
     }
      
    
       deleteWriteOff(id: string): Observable<any> {
         return this.httpClient.delete(`${this.apiUrl}${id}` , this.httpOptions)
           .pipe(
             catchError(this.handleError)
           );
       }
     }



