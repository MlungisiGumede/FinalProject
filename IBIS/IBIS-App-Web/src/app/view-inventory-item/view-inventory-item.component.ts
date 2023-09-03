import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../Services/inventory.service';
import { ToastController } from '@ionic/angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inventory } from '../Models/Inventory';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-view-inventory-item',
  templateUrl: './view-inventory-item.component.html',
  styleUrls: ['./view-inventory-item.component.css']
})
export class ViewInventoryItemComponent implements OnInit {

  id:any;
  data:any;
  suppliers:any
  selectedValue:any
  form!: FormGroup;

  constructor(private route : ActivatedRoute, private fb : FormBuilder,private inv: InventoryService,private toastController: ToastController,
    @Inject(MAT_DIALOG_DATA) public item: any,private matDialogRef:MatDialogRef<ViewInventoryItemComponent>) { }

  ngOnInit(): void {

   // this.id = this.item.inventory_ID
    
this.suppliers = this.item.suppliers
  console.log(this.item)
      this.form = new FormGroup({
        sKU: new FormControl(this.item.item.sku,Validators.required),
        name: new FormControl(this.item.item.name,Validators.required),
        supplier_ID: new FormControl(this.item.item.supplier_ID,Validators.required),
        inventory_ID: new FormControl(this.item.item.inventory_ID),
  
      })
      //this.selectedValue = this.item.item.supplierID
      this.id = this.item.item.inventory_ID
      console.log(this.id)
    }


  update(){

    this.inv.updateInventory(this.id,this.form.value).pipe(map(
      (res)=>{




    }),
    catchError((err) =>{
      console.log(err)
      this.matDialogRef.close(false);
     
      return throwError(err)
    }))
.subscribe(response => {
      console.log("successfully updated",response);
      this.presentToast('top')
      this.matDialogRef.close(true)

  }), (error:any) => {
    this.matDialogRef.close(false)
  };
}


  submit(){



  }


  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'inventory successfully Updated',
      duration: 5000,
      position: position,
      color: 'success'
    });

    await toast.present();
  }


}
