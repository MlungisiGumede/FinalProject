import { Component, OnInit,Inject } from '@angular/core';
import { CustomerService } from '../Services/customer.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
form:any
constructor(public matDialogRef: MatDialogRef<AddCustomerComponent>
  ,public customerService:CustomerService,@Inject(MAT_DIALOG_DATA) public element: any) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      Customer_FirstName: new FormControl("",Validators.required), // fill with the API calls...
      Customer_Surname: new FormControl("",Validators.required),
  
      Email: new FormControl("",Validators.email),
      Address: new FormControl("",Validators.required),
     Phone: new FormControl("",[Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]),
     // off the internet regex... Validators.pattern("^[0-9]*$")
    }) 
  }
  display(){
    console.log(this.form.value)
  }

  CreateCustomer(){
    console.log("hi")
    this.customerService.CreateCustomer(this.form.value).pipe(map(
      (res)=>{




    }),
    catchError((err) =>{
      console.log(err)
      this.matDialogRef.close(false);
     
      return throwError(err)
    })).
subscribe(res=>{
      console.log("success", res);
      this.matDialogRef.close(true)
      }),(err:any)=>{
        this.matDialogRef.close(false)
      }
      
      }

}
