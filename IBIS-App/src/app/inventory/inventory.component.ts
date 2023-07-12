import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../Services/inventory.service';
import { Inventory } from '../Models/Inventory';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  data:any
  invent: Inventory[] = [];
  idtodelete :any;
  search= "";

  constructor(public router: Router, private inv : InventoryService) { }

  ngOnInit() {
    this.getInventory()
  }

  getInventory(){
    this.inv.getInventoryList().subscribe(response => {
      console.log(response);
      this.data = response;
    })
    

  }


  async delete(id: number){
    this.idtodelete = id;

this.inv.delete(this.idtodelete).subscribe(Response => {
  console.log(Response);
  this.data = Response;
this.getInventory();
})
  }



  addInventoryItem(){

    this.router.navigate(['/add-inventory-item']);

  }

}
