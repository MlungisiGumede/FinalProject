import { Component, OnInit } from '@angular/core';
import { Supplier } from '../Models/Supplier';
import { SupplierService } from '../Services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  data: any;
  Suppliers : Supplier[]=[];
  bool= false;
  idtodelete :any;
id: any;
filterTerm!: string;
  

  constructor(private supply: SupplierService,public router: Router,private route: ActivatedRoute,private logged: LoginService,private toastController: ToastController) { 

    supply = {} as SupplierService;
  }

  ngOnInit() {

   

this.getall();

  }



  getall(){

    this.supply.getSupplierList().subscribe(response => {
      console.log(response);
      this.data = response;
    })

  }



  addsupplier(){
  

      this.router.navigate(['/AddProduct']);
  
    }

    async delete(id: number){
      this.idtodelete = id;
  
  this.supply.delete(this.idtodelete).subscribe(Response => {
    console.log(Response);
    this.data = Response;
    this.presentToast
  this.getall();
  })
    }



logout(){
this.logged.setlogin(true)

this.logged.getlogin().subscribe((value) => {
  this.bool = value;
  console.log("you are no longer logged in",this.bool)
});

this.router.navigate(['/Login']);
}


async presentToast(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'Supplier successfully removed',
    duration: 5000,
    position: position,
    color: 'success'
  });

  await toast.present();
}



  }


