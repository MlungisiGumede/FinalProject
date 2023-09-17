import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Inventory } from '../Models/Inventory';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {


  apiUrl = environment.apiUrl + 'Item';
  
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
      
      
      
      
       createInventory(inv: Inventory){
        return this.httpClient.post(this.apiUrl, inv, this.httpOptions)
      }
  
    
    
       getInventoryList(): Observable<Inventory[]> {
         return this.httpClient
         .get<Inventory[]>(this.apiUrl + '/getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getinv(id: any): Observable<Inventory> {
         return this.httpClient
           .get<Inventory>(this.apiUrl + "/" +id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
       public getInventoriesPerSupplier(id:any){
        return this.httpClient.post(this.apiUrl + '/getInventoriesPerSupplier',id)
       }
      
       updateInventory(id: any, data: any): Observable<Inventory> {
         return this.httpClient
           .put<Inventory>(this.apiUrl + '/' + id, data, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       delete(id:number){
        return this.httpClient.delete<Inventory>(`${this.apiUrl}/${id}` , this.httpOptions);
     }



    
       deleteInventory(id: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${id}` , this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }
     }


