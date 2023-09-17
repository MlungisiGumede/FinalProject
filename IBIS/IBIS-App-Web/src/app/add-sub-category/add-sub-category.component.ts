import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OrdersService } from '../Services/orders.service';
import { ProductService } from '../Services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.css']
})
export class AddSubCategoryComponent implements OnInit {
categories:any
form:any
  constructor(public dialogRef: MatDialogRef<AddSubCategoryComponent>,
    public productService:ProductService) { }

  ngOnInit(): void {
this.productService.getCategoriesList().subscribe((res)=>{
  console.log(res)
  this.categories = res
})
this.form = new FormGroup({
  name: new FormControl('',[Validators.required]),
  category_ID: new FormControl('',[Validators.required])
})
  }
  AddSubCategory(){
    console.log(this.form.value)
    this.productService.AddSubCategory(this.form.value).pipe(map(
      (res)=>{






    }),
    catchError((err) =>{
      console.log(err)
      this.dialogRef.close(false);
     
      return throwError(err)
    }))
.subscribe((res)=>{
  this.dialogRef.close(true);
    })
  }
  SetValue(value:any){
   
    this.form.controls.get("category_ID").setValue(value)
    console.log(this.form.value)
  }

}
