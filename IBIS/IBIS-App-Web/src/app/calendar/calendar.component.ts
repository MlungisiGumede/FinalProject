import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarModalComponent } from '../calendar-modal/calendar-modal.component';
import { EventsService, Event } from '../Services/events.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  selectedDate!: string;
  selectedTime!: string;
  events: Event[] = [];
  eventsForSelectedDate: Event[] = [];

  constructor(private modalController: ModalController, private eventsService: EventsService) { }

  async openEventModal() {
    const modal = await this.modalController.create({
      component: CalendarModalComponent,
      componentProps: {
        selectedDate: this.selectedDate
        // Pass any data you want to the modal here
        // For example, you can pass selectedDate and selectedTime
      },
    });
    await modal.present();
  }

  loadEventsForSelectedDate() {
    this.eventsForSelectedDate = this.eventsService.getEventsForDate(this.selectedDate);
    console.log('Events for this date: ', this.eventsForSelectedDate);

  }

  ngOnInit(): void {
    this.events = this.eventsService.getAllEvents();
    
  }

  

  isEventDay(date: string): boolean {
    const eventsForDate = this.eventsService.getEventsForDate(date);
    return eventsForDate.length > 0;
  }

  getEventDayClass(date: string): string {
    return this.isEventDay(date) ? 'event-day' : '';
  }

  
  
}
