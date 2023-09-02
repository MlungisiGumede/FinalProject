import { Component, OnInit } from '@angular/core';
import { Supplier } from '../Models/Supplier';
import { SupplierService } from '../Services/supplier.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddSupplierOrderComponent } from '../add-supplier-order/add-supplier-order.component';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  data: any;
  sup!: Supplier;
  form!:FormGroup
  constructor(private supply: SupplierService,public router:Router,private toastController: ToastController
    ,public matDialogRef:MatDialogRef<AddSupplierOrderComponent>) { 

this.data = new Supplier();

  }

  ngOnInit(): void {
  this.form = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]),
    email: new FormControl('', Validators.email),
  })
  }


createSupplier(){
let supplier = new Supplier()
supplier.name = this.form.controls['name'].value
supplier.address = this.form.controls['address'].value
supplier.phone = this.form.controls['phone'].value
supplier.email = this.form.controls['email'].value
this.supply.createSupplier(supplier).subscribe(res=>{
console.log("success", res);
this.presentToast('top')
this.router.navigate(["/Suppliers"])
})

}

async presentToast(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'Supplier successfully created',
    duration: 5000,
    position: position,
    color: 'success'
  });

  await toast.present();
}



}
