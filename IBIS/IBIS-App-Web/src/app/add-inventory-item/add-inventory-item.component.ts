import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../Services/inventory.service';
import { Router } from '@angular/router';
import { Inventory } from '../Models/Inventory';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-inventory-item',
  templateUrl: './add-inventory-item.component.html',
  styleUrls: ['./add-inventory-item.component.css']
})
export class AddInventoryItemComponent implements OnInit {
  
  data:any;
  inv!: Inventory;

  constructor(private invService: InventoryService,public router:Router,private toastController: ToastController) {

    this.data = new Inventory();
   }

  ngOnInit(): void {
  }


  createInventory(){
    this.presentToast('top')
    this.invService.createInventory(this.data).subscribe(res=>{
    console.log("success", res);
    this.presentToast('top')
    this.router.navigate(['/Inventory']);
    })
    
    }

    async presentToast(position: 'top' | 'middle' | 'bottom') {
      const toast = await this.toastController.create({
        message: 'inventory successfully created',
        duration: 5000,
        position: position,
        color: 'success'
      });
  
      await toast.present();
    }


   // this.router.navigate(['/add-product']);

}
