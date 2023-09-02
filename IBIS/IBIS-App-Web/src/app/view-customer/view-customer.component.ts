import { Component, OnInit,Inject } from '@angular/core';
import { CustomerService } from '../Services/customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../Models/Customer';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {
form:any
  constructor(public matDialogRef: MatDialogRef<ViewCustomerComponent>
    ,public customerService:CustomerService,@Inject(MAT_DIALOG_DATA) public element: Customer){

    }

  ngOnInit(): void {
    console.log(this.element)
    this.form = new FormGroup({
      Customer_ID: new FormControl(this.element.customer_ID),
      Customer_FirstName: new FormControl(this.element.customer_FirstName,Validators.required), // fill with the API calls...
      Customer_Surname: new FormControl(this.element.customer_Surname,Validators.required),

      Email: new FormControl(this.element.email,Validators.email),
      Address: new FormControl(this.element.address,Validators.required),
     Phone: new FormControl(this.element.phone,[Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]),
     // off the internet regex...
    })

  }
  EditCustomer(){
    this.customerService.UpdateCustomer(this.form.value).subscribe(res=>{
      console.log("success", res);
      this.matDialogRef.close('success')
      }),(err:any)=>{
        this.matDialogRef.close('error')
      }
  }


}
