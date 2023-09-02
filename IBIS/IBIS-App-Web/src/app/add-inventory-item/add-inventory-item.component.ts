import { Component, OnInit,Inject } from '@angular/core';
import { InventoryService } from '../Services/inventory.service';
import { Router } from '@angular/router';
import { Inventory } from '../Models/Inventory';
import { ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-inventory-item',
  templateUrl: './add-inventory-item.component.html',
  styleUrls: ['./add-inventory-item.component.css']
})
export class AddInventoryItemComponent implements OnInit {
  
  //data:any;
  inv!: Inventory;
  form!:any
  suppliers:any

  constructor(private invService: InventoryService,public router:Router,private toastController: ToastController
    ,public matDialogRef:MatDialogRef<AddInventoryItemComponent>
    ,@Inject(MAT_DIALOG_DATA) public data:any) { 

    this.data = new Inventory();
   this.suppliers = data
   }

  ngOnInit(): void {
    this.form = new FormGroup({
      sku: new FormControl("",Validators.required),
      name: new FormControl("",Validators.required),
      supplier_ID: new FormControl("",Validators.required),
    })
  }


  createInventory(){
    this.presentToast('top')
    console.log(this.form.value)
    this.invService.createInventory(this.form.value).subscribe(res=>{
    console.log("success", res);
    this.presentToast('top')
    this.matDialogRef.close(true)
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
