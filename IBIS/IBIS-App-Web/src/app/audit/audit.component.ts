import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuditDetailsComponent } from '../audit-details/audit-details.component';
import { UserService } from '../Services/user.service';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AuditHelpComponent } from '../audit-help/audit-help.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
data:any
filterTerm:any
columnsSchema:any = [{key:'id',name:'Audit ID'}, {key:'name',name:'Name Of Operation'}, {key:'user',name:'UserName'},{key:'date',name:'Date'}, {key:'actions',name:''}]
  displayedColumns: string[] = this.columnsSchema.map((x:any) => x.key);
  @ViewChild(MatPaginator) paginator!: MatPaginator
  dataSource:MatTableDataSource<any> = new MatTableDataSource<any>();
  constructor(public matDialog:MatDialog,
    private userService:UserService,public helpModal: ModalController,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.userService.getAuditTrail().subscribe(res=>{
      console.log(res)
      this.dataSource.data = res
      this.dataSource.paginator = this.paginator
      this.data = of(res)
      this.spinner.hide();
    });
  }
  filter(event:any){
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: AuditHelpComponent});
      return await modal.present();
  }
  
  
ViewDetails(details:any){
  //let detail =  JSON.parse(details)
  var retrievedObject = JSON.parse(details.replace(/\<br \/\>/g, ''));
  // https://stackoverflow.com/questions/23615480/replace-string-in-value-from-an-javascript-object
  console.log(retrievedObject)
  //console.log(detail)
  this.matDialog.open(AuditDetailsComponent,
  {
    data:retrievedObject
  });
}
}
