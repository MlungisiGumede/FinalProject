import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  id:any;
  data:any;

  viewproductform!: FormGroup;

  constructor(private route : ActivatedRoute, private fb : FormBuilder,private prod: ProductService ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id']
    this.viewproductform = this.fb.group({

      product_Name : ['', Validators.required],
      category: ['', Validators.required],
      subcategory : ['', Validators.required],
      price : ['', Validators.required],
      phone : ['', Validators.required],
      quantity : ['', Validators.required],
      expiry :  ['', Validators.required]
    })
    
    this.id = this.route.snapshot.params['id']

this.prod.getprod(this.id).subscribe((res)=>{

this.data = res
res = this.viewproductform.value

console.log('Product:', this.data)
});
  
}


  


  update(){

    this.prod.updateProduct(this.id,this.data).subscribe(response => {
      console.log("successfully updated",response);

  });
}

  submit(){



  }

}


