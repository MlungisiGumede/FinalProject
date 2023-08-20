import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SupplierService } from '../Services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from '../Models/Supplier';

@Component({
  selector: 'app-create-supplier-order',
  templateUrl: './create-supplier-order.component.html',
  styleUrls: ['./create-supplier-order.component.css']
})
export class CreateSupplierOrderComponent implements OnInit {
  data: any;
  sup!: Supplier;
  id:any;
  ord: any;

  viewordersupplierform!: FormGroup;
  constructor(private supply: SupplierService,public router:Router,private toastController: ToastController,private route : ActivatedRoute,private fb : FormBuilder) { 
  }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id']
    this.viewordersupplierform = this.fb.group({

      supplier_ID : ['', Validators.required],
      inventory_Item_Id: ['', Validators.required],
      quantity : ['', Validators.required],
      order_Status : ['', Validators.required],
      Suppliername: ['', Validators.required]
    })
    this.id = this.route.snapshot.params['id']

    this.supply.getSup(this.id).subscribe((res)=>{

      this.data = res
      res = this.viewordersupplierform.value
      
      console.log('order:', this.data)
      });

      this.ord = this.data;

  }


  update(){

    this.supply.updateSupplier(this.id,this.data).subscribe(response => {
      console.log("successfully updated",response);
      this.presentToast('top')
      this.router.navigate(["/Orders"])

  });
}


async presentToast(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'Supplier order successfully created',
    duration: 5000,
    position: position,
    color: 'success'
  });

  await toast.present();
}

}
