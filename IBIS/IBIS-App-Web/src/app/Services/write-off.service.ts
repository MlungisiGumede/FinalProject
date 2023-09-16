import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, retry, throwError } from 'rxjs';
import { Supplier } from '../Models/Supplier';
import { WriteOff } from '../Models/writeOff';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WriteOffService {
public adjustQuantity = new BehaviorSubject<any>(null);

  apiUrl = environment.apiUrl + 'writeOff/';


  

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
      
      
      
      
       createWriteOff(writeOff: WriteOff){
        console.log(writeOff)
        return this.httpClient.post(this.apiUrl , writeOff, this.httpOptions)
      }
  
    
    
       getWriteOffList(): Observable<WriteOff> {
         return this.httpClient
         .get<WriteOff>(this.apiUrl + 'getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getwriteOff(id: any): Observable<WriteOff> {
         return this.httpClient
           .get<WriteOff>(this.apiUrl  + id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       updateWriteOff(id: any, data: any): Observable<WriteOff> {
         return this.httpClient
           .put<WriteOff>(this.apiUrl + id, data, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }

       delete(id:number){
        return this.httpClient.delete<WriteOff>(`${this.apiUrl}${id}` , this.httpOptions);
     }
      
    
       deleteWriteOff(id: string): Observable<any> {
         return this.httpClient.delete(`${this.apiUrl}${id}` , this.httpOptions)
           .pipe(
             catchError(this.handleError)
           );
       }
     }



