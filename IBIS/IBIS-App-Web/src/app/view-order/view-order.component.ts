import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../Services/orders.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  id:any;
  data:any;

  viewOrderform!: FormGroup;

  constructor(private route : ActivatedRoute, private fb : FormBuilder,private ord : OrdersService,public router: Router,private toastController: ToastController) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.viewOrderform = this.fb.group({

  
    SKU : ['', Validators.required],
    Name: ['', Validators.required],
      quantity : ['', Validators.required],
      InventoryId :  ['', Validators.required]
    })
  
    this.id = this.route.snapshot.params['id']

    this.ord.getord(this.id).subscribe((res)=>{
    
    this.data = res
    res = this.viewOrderform.value
    
    console.log('ord:', this.data)
    });







  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
    message: 'Supplier Order has been updated',
    duration: 5000,
    position: position,
    color: 'success'
  });

  await toast.present();
  }


concludeOrder(){

  this.presentToast('top')


  this.router.navigate(['/Orders']);

}





  update(){



    this.ord.updateOrder(this.id,this.data).subscribe(response => {
      console.log("successfully updated",response);

      this.concludeOrder();
  });
}

}
