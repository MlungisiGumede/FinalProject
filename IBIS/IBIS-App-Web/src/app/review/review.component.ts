import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdersService } from '../Services/orders.service';
import { CustomerOrder } from '../Models/CustomerOrder';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  constructor(private matDialogRef:MatDialogRef<ReviewComponent>,private orderservice:OrdersService,
    @Inject(MAT_DIALOG_DATA) public item: CustomerOrder) { }
form = new FormGroup({
  review : new FormControl("",[Validators.required,Validators.maxLength(50)]),
})
  ngOnInit(): void {
  
  }
  Submit(){
    this.item.review = this.form.get('review')?.value
    console.log(this.item)
    this.orderservice.UpdateCustomerOrderStatus(this.item).subscribe((res)=>{
      this.matDialogRef.close(true)
    })
  }
  Close(){
    this.matDialogRef.close()
    //this.form.reset()
  }

}
