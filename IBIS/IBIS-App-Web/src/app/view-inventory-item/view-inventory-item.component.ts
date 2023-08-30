import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../Services/inventory.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-inventory-item',
  templateUrl: './view-inventory-item.component.html',
  styleUrls: ['./view-inventory-item.component.css']
})
export class ViewInventoryItemComponent implements OnInit {

  id:any;
  data:any;
  suppliers:any

  form!: FormGroup;

  constructor(private route : ActivatedRoute, private fb : FormBuilder,private inv: InventoryService,private toastController: ToastController) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id']
    

  
      this.form = new FormGroup({
        sKU: new FormControl("",Validators.required),
        name: new FormControl("",Validators.required),
        supplier_ID: new FormControl("",Validators.required),
      
  
      })
    }


  update(){

    this.inv.updateInventory(this.id,this.data).subscribe(response => {
      console.log("successfully updated",response);
      this.presentToast('top')

  });
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
