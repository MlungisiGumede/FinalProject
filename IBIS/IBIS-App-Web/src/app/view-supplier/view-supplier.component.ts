import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupplierService } from '../Services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Supplier } from '../Models/Supplier';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.css']
})
export class ViewSupplierComponent implements OnInit {
  
  
  id:any;
  data:any;
 form!: FormGroup

  constructor(private route: ActivatedRoute,private supplys : SupplierService, private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public item: Supplier,private matDialogRef:MatDialogRef<ViewSupplierComponent>) { }

  ngOnInit(): void {
    this.form = this.fb.group({

      name : [this.item.name, Validators.required],
      address : [this.item.address, Validators.required],
      email : [this.item.email, Validators.required],
      supplier_ID : [this.item.supplier_ID, ],
      phone : [this.item.phone, Validators.required]
    })
    
    this.id = this.item.supplier_ID

  
}



async update(){


  //this.id = this.route.snapshot.params['id']

    this.supplys.updateSupplier(this.id,this.form.value).pipe(map(
      (res)=>{




    }),
    catchError((err) =>{
      console.log(err)
      this.matDialogRef.close(false);
     
      return throwError(err)
    })).
subscribe(response => {
      console.log("successfully updated",response);
      this.supplys.getSupplierList().subscribe(response => {
        this.matDialogRef.close(true);
      }), (error:any) => {
        this.matDialogRef.close(false);
      }
      //this.router.navigate(['student-list']);
     
      
    })
  }




  

}
