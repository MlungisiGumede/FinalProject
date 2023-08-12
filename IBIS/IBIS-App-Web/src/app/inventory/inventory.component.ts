import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../Services/inventory.service';
import { Inventory } from '../Models/Inventory';
import { ToastController } from '@ionic/angular';
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

  constructor(public router: Router, private inv : InventoryService,private toastController: ToastController) { }

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
this.presentToast('top')
  }



  addInventoryItem(){

    this.router.navigate(['/add-inventory-item']);

  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'you have successfully removed an inventory item',
      duration: 3000,
      position: position,
      color: 'success'
    });

    await toast.present();
  }

}
