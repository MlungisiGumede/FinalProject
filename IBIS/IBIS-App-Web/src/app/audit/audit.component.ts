import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuditDetailsComponent } from '../audit-details/audit-details.component';
import { UserService } from '../Services/user.service';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AuditHelpComponent } from '../audit-help/audit-help.component';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
data:any
filterTerm:any
  constructor(public matDialog:MatDialog,
    private userService:UserService,public helpModal: ModalController) { }

  ngOnInit(): void {
    this.userService.getAuditTrail().subscribe(res=>{
      console.log(res)
      this.data = of(res)
    });
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
