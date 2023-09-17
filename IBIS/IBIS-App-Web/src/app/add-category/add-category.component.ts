import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../Services/product.service';
import {map,catchError,} from 'rxjs/operators';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
form:any
  constructor(public dialogRef: MatDialogRef<AddCategoryComponent>,public productService:ProductService) { }

  ngOnInit(): void {
  this.form = new FormGroup({
    name: new FormControl('',[Validators.required])
  })
  }

AddCategory(){
this.productService.AddCategory(this.form.value).pipe(map(
  (res)=>{






}),
catchError((err) =>{
  console.log(err)
  
  this.dialogRef.close(false);
 
  return err
}))

.subscribe(res=>{
  console.log("success", res);
  this.dialogRef.close(true);
})
}
}

