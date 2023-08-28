import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, retry, tap, throwError,switchMap } from 'rxjs';
import { Orders } from '../Models/Orders';
import { Product } from '../Models/Product';
import { Inventory } from '../Models/Inventory';
import { CustomerOrderLine } from '../Models/CustomerOrderLine';
import { SupplierOrderLine } from '../Models/SupplierOrderLine';
import { CustomerOrder } from '../Models/CustomerOrder';
import { SupplierOrder } from '../Models/SupplierOrder';
import { CustomerOrderViewModel } from '../Models/CustomerOrderViewModel';
import { SupplierOrderViewModel } from '../Models/SupplierOrderViewModel';

@Injectable({
  providedIn: 'root'
})

export class OrdersService {
  apiUrl = 'https://localhost:7226/api/Order';
  productApiUrl = 'https://localhost:7226/api/Products';
  inventoryApiUrl = 'https://localhost:7226/api/Item';
  customersApiUrl = 'https://localhost:7226/api/Customers';
  suppliersApiUrl = 'https://localhost:7226/api/Suppliers';

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
  
    UpdateOrderStatus(item:CustomerOrder){
      return this.httpClient.put(this.apiUrl + '/PutCustomerOrder', item, this.httpOptions)
    }
    
       getOrderList(): Observable<Orders> {
         return this.httpClient
         .get<Orders>(this.apiUrl + '/getAll')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
       }
       getCustomerOrderList(): Observable<CustomerOrder[]> {
         return this.httpClient
           .get<CustomerOrder[]>(this.apiUrl + '/getCustomerOrder')
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
         
       }
       getSupplierOrderList(): Observable<SupplierOrder[]> {
        return this.httpClient
          .get<SupplierOrder[]>(this.apiUrl + '/getSupplierOrder')
          .pipe(
            retry(2),
            catchError(this.handleError)
          )
        
      }

       getCustomerOrderLine(customerOrder: any): Observable<CustomerOrderLine[]> {
        console.log(customerOrder)
         return this.httpClient
           .post<CustomerOrderLine[]>(this.apiUrl + '/getCustomerOrderLine', customerOrder)
           .pipe(
             retry(2),
             catchError(this.handleError)
           )
         
         
       }
       getSupplierOrderLine(id: any): Observable<SupplierOrderLine[]> {
        return this.httpClient
          .get<SupplierOrderLine[]>(this.apiUrl + '/getInventoryByOrder/' + id)
          .pipe(
            retry(2),
            catchError(this.handleError)
          )
        
      }
      getOrders():Observable<any>{
        return forkJoin([
          this.httpClient.get(this.apiUrl + '/getCustomerOrders').pipe(tap(res => console.log(res))),
          this.httpClient.get(this.apiUrl + '/getSupplierOrders').pipe(tap(res => console.log(res))),
          this.httpClient.get(this.customersApiUrl + '/getAll').pipe(tap(res => console.log(res))),
          this.httpClient.get(this.suppliersApiUrl + '/getAll').pipe(tap(res => console.log(res)))
        ])
      }
      CreateCustomerOrder(ord: CustomerOrder, ordLines: CustomerOrderLine[],total:any) {
        console.log(ord)
        let returnVal = false
        this.httpClient.post(this.apiUrl + '/PostCustomerOrder', ord).subscribe(
          (res) => {
            console.log(res)
           ordLines.forEach((element:CustomerOrderLine) => {
             element.customer_Order_ID = res
           })
            this.httpClient.post(this.apiUrl + '/PostCustomerOrderLine',ordLines).subscribe( ()=>{
                    returnVal = true
                    total = null
            }
                 
            )
          }
        )
        return total
        }
        ;

          

          

       
      
      CreateSupplierOrder(ord: SupplierOrderViewModel){
        return this.httpClient.post(this.apiUrl + "/PostSupplierOrder", ord, this.httpOptions)
      }
      UpdateCustomerOrder( data: CustomerOrder,element:CustomerOrderLine[]): any {
        // return this.httpClient
        //   .put<CustomerOrder>(this.apiUrl +  "/PutCustomerOrder", data, this.httpOptions)
        //   .pipe(
        //     retry(2),
        //     catchError(this.handleError)
        //   )
       return forkJoin([
            this.httpClient.put(this.apiUrl + '/PutCustomerOrder',data).pipe(tap(res => console.log(res))),
            this.httpClient.put(this.apiUrl + '/PutCustomerOrderLine',element).pipe(tap(res => console.log(res))),
          
          ])
      }
      UpdateSupplierOrder( data: any): Observable<SupplierOrder> {
        return this.httpClient
          .put<SupplierOrder>(this.apiUrl + '/' , data, this.httpOptions)
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
      
       DeleteCustomerOrder(id:number):Observable<any>{
        // return forkJoin([
        //   this.httpClient.delete(this.apiUrl + '/DeleteCustomerOrder' + id).pipe(tap(res => console.log(res))),
        //   this.httpClient.delete(this.apiUrl + '/DeleteCustomerOrderLine' + id).pipe(tap(res => console.log(res))),
        // ])
        return this.httpClient.delete(this.apiUrl + '/' + id).pipe(tap(res => console.log(res)))
     }



    
       deleteOrder(id: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${id}` , this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }
}
