import { Component, OnInit } from '@angular/core';
import { Supplier } from '../Models/Supplier';
import { SupplierService } from '../Services/supplier.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  data: any;
  sup!: Supplier;
  constructor(private supply: SupplierService,public router:Router,private toastController: ToastController) { 

this.data = new Supplier();

  }

  ngOnInit(): void {

  }


createSupplier(){

this.supply.createSupplier(this.data).subscribe(res=>{
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
