import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';
import { ProductService } from '../Services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-write-off',
  templateUrl: './write-off.component.html',
  styleUrls: ['./write-off.component.css']
})
export class WriteOffComponent implements OnInit {

  lastEmittedValue: RangeValue | undefined;
  id: any;
  data:any;
  viewproductform!: FormGroup;

  onIonChange(ev: Event) {
    this.lastEmittedValue = (ev as RangeCustomEvent).detail.value;
  }

  constructor(private route : ActivatedRoute,private prod: ProductService,private fb : FormBuilder) { 
   
  }


  

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
      
      console.log('Product loaded:', this.data)
      });


  }

}
