import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupplierService } from '../Services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.css']
})
export class ViewSupplierComponent implements OnInit {
  
  
  id:any;
  data:any;
 viewsupplierform!: FormGroup

  constructor(private route: ActivatedRoute,private supplys : SupplierService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.viewsupplierform = this.fb.group({

      companyName : ['', Validators.required],
      city : ['', Validators.required],
      addressline : ['', Validators.required],
      region : ['', Validators.required],
      phone : ['', Validators.required]
    })
    
    this.id = this.route.snapshot.params['id']

this.supplys.getSup(this.id).subscribe((res)=>{

this.data = res
res = this.viewsupplierform.value

console.log('supplier:', this.data)
});
  
}



async update(){


  //this.id = this.route.snapshot.params['id']

    this.supplys.updateSupplier(this.id,this.data).subscribe(response => {
      console.log("successfully updated",response);
      
      //this.router.navigate(['student-list']);
     
      
    })
  }




  

}
