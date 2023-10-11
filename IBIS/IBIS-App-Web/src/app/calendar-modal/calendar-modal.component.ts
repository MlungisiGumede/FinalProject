import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EventsService, Event } from '../Services/events.service';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.css']
})
export class CalendarModalComponent implements OnInit {
  @Input() selectedDate: any;
  eventDescription!: string;
  constructor(private modalController: ModalController, private loginService: LoginService) {
    console.log(this.selectedDate)
   }
  

  dismissModal() {
    this.modalController.dismiss();
  }

  saveEvent() {
    console.log(this.selectedDate);
    // Save the event with this.eventDescription and selected date(s)
    // You can send this data to your service or perform any other actions here
    const event: any = {
      date: this.selectedDate,
      description: this.eventDescription
    };
    
    this.loginService.AddEvent(event).subscribe(res => {
     
    });
    console.log('Event added:', event);
    
    this.modalController.dismiss("date");
  }

  ngOnInit(): void {
    console.log(this.selectedDate)
  }

}
