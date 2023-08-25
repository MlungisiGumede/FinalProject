import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css']
})
export class ViewImageComponent implements OnInit {
imageDisplay:any
  constructor(public matDialog: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public image: any) { }

  ngOnInit(): void {
    console.log(this.image)
  this.imageDisplay = this.image[0].image
  console.log(this.imageDisplay)
  }

}
