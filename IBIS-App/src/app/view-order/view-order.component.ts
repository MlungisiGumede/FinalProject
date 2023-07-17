import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../Services/orders.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  id:any;
  data:any;

  viewOrderform!: FormGroup;

  constructor(private route : ActivatedRoute, private fb : FormBuilder,private ord : OrdersService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.viewOrderform = this.fb.group({

  
    SKU : ['', Validators.required],
    Name: ['', Validators.required],
      quantity : ['', Validators.required],
      InventoryId :  ['', Validators.required]
    })
  
    this.id = this.route.snapshot.params['id']

    this.ord.getord(this.id).subscribe((res)=>{
    
    this.data = res
    res = this.viewOrderform.value
    
    console.log('ord:', this.data)
    });







  }


  update(){

    this.ord.updateOrder(this.id,this.data).subscribe(response => {
      console.log("successfully updated",response);

  });
}

}
