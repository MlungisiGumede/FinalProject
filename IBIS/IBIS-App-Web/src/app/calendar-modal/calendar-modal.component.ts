import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EventsService, Event } from '../Services/events.service';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.css']
})
export class CalendarModalComponent implements OnInit {
  @Input() selectedDate!: string;
  eventDescription!: string;
  constructor(private modalController: ModalController, private eventsService: EventsService) { }

  dismissModal() {
    this.modalController.dismiss();
  }

  saveEvent() {
    // Save the event with this.eventDescription and selected date(s)
    // You can send this data to your service or perform any other actions here
    const event: Event = {
      date: this.selectedDate,
      description: this.eventDescription
    };
    
    this.eventsService.addEvent(event);
    console.log('Event added:', event);
    
    this.modalController.dismiss();
  }

  ngOnInit(): void {
  }

}
