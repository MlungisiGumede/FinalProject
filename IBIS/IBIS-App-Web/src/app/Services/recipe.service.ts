import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Product } from '../Models/Product';
import { Recipe } from '../Models/Recipes';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  apiUrl = 'https://localhost:7226/api/Recipe';


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
      
      
      
      
       createRecipe(rec: Recipe){
        return this.httpClient.post(this.apiUrl,rec, this.httpOptions)
      }
  
    
    
       getRecipeList(): Observable<Recipe> {
         return this.httpClient
         .get<Recipe>(this.apiUrl + '/getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
    
       getrec(id: any): Observable<Recipe> {
         return this.httpClient
           .get<Recipe>(this.apiUrl + "/" +id)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       updateRecipe(id: any, data: any): Observable<Recipe> {
         return this.httpClient
           .put<Recipe>(this.apiUrl + '/' + id, data, this.httpOptions)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
      
       delete(id:number){
        return this.httpClient.delete<Recipe>(`${this.apiUrl}/${id}` , this.httpOptions);
     }



    
       deleteRecipe(id: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${id}` , this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }
     }





  

