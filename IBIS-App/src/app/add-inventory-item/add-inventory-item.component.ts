import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../Services/inventory.service';
import { Router } from '@angular/router';
import { Inventory } from '../Models/Inventory';

@Component({
  selector: 'app-add-inventory-item',
  templateUrl: './add-inventory-item.component.html',
  styleUrls: ['./add-inventory-item.component.css']
})
export class AddInventoryItemComponent implements OnInit {
  
  data:any;
  inv!: Inventory;

  constructor(private invService: InventoryService,public router:Router) {

    this.data = new Inventory();
   }

  ngOnInit(): void {
  }


  createInventory(){

    this.invService.createInventory(this.data).subscribe(res=>{
    console.log("success", res);
    })
    
    }

}
