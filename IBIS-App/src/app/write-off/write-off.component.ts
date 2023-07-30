import { Component, OnInit } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';

@Component({
  selector: 'app-write-off',
  templateUrl: './write-off.component.html',
  styleUrls: ['./write-off.component.css']
})
export class WriteOffComponent implements OnInit {

  lastEmittedValue: RangeValue | undefined;

  onIonChange(ev: Event) {
    this.lastEmittedValue = (ev as RangeCustomEvent).detail.value;
  }

  constructor() { }


  

  ngOnInit(): void {
  }

}
