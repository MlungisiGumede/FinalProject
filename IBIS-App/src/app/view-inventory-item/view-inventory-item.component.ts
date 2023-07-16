import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../Services/inventory.service';

@Component({
  selector: 'app-view-inventory-item',
  templateUrl: './view-inventory-item.component.html',
  styleUrls: ['./view-inventory-item.component.css']
})
export class ViewInventoryItemComponent implements OnInit {

  id:any;
  data:any;

  viewinventoryform!: FormGroup;

  constructor(private route : ActivatedRoute, private fb : FormBuilder,private inv: InventoryService) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id']
    this.viewinventoryform = this.fb.group({

  
    SKU : ['', Validators.required],
    Name: ['', Validators.required],
      quantity : ['', Validators.required],
      InventoryId :  ['', Validators.required]
    })
  
    this.id = this.route.snapshot.params['id']

    this.inv.getinv(this.id).subscribe((res)=>{
    
    this.data = res
    res = this.viewinventoryform.value
    
    console.log('inv:', this.data)
    });
  
  
  
  
  }


  update(){

    this.inv.updateInventory(this.id,this.data).subscribe(response => {
      console.log("successfully updated",response);

  });
}

  submit(){



  }

}
