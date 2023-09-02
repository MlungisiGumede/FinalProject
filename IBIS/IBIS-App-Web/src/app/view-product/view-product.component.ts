import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../Models/Product';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  id:any;
  data:any;

  form!: FormGroup;

  constructor(private route : ActivatedRoute, private fb : FormBuilder,private prod: ProductService,
    @Inject(MAT_DIALOG_DATA) public item: Product,private dialogRef: MatDialogRef<ViewProductComponent>) { }

  ngOnInit(): void {

    
    this.form = this.fb.group({
      product_ID : [this.item.product_ID,],
      name : [this.item.name, Validators.required],
      category: [this.item.category, Validators.required],
      subCategory : [this.item.subcategory, Validators.required],
      price : [this.item.price, Validators.required],
     // phone : ['', Validators.required],
     // quantity : ['', Validators.required],
      expiry :  [this.item.expiry, Validators.required]
    })
    
    

  
}


  


  update(){

    this.prod.updateProduct(this.form.value).subscribe(response => {
      console.log("successfully updated",response);
      this.dialogRef.close(true);
  }), (error:any) => {
    console.log(error);
    this.dialogRef.close(false);
  };
}

  submit(){



  }

}


