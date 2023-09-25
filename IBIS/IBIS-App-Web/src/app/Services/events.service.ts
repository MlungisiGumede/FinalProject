import { Injectable } from '@angular/core';

export interface Event {
    date: string;
    description: string;
  }
@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private events: Event[] = [];
  private eventDates: string[] = [];

  addEvent(event: Event) {
    this.events.push(event);
    if (!this.eventDates.includes(event.date)) {
      this.eventDates.push(event.date);
    }
  }

  getEventsForDate(date: string): Event[] {
    return this.events.filter((event) => event.date === date);
  }

  getAllEvents(): Event[] {
    return this.events;
  }
  
  getEventDates(): string[] {
    return this.eventDates;
  }
}
