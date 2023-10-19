import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarModalComponent } from '../calendar-modal/calendar-modal.component';
import { EventsService, Event } from '../Services/events.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../Services/login.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CalenderHelpComponent } from '../calender-help/calender-help.component';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { CalendarComponent } from 'ionic2-calendar/calendar';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  selectedDate: any;
  selectedTime!: string;
  events: Event[] = [];
  view = false
  form: FormGroup = new FormGroup({
    date: new FormControl("2023-09-02"),
  });
  date = "2023-09-02";
  filteredEvents:any = of([]);
 
  // highlightedDates:any = [
  //   {
  //     date: '2023-09-05',
  //     textColor: '#800080',
  //     backgroundColor: '#ffc0cb',
  //   },
  //   {
  //     date: '2023-09-10',
  //     textColor: '#09721b',
  //     backgroundColor: '#c8e5d0',
  //   },
   
  //   {
  //     date: '2023-09-23',
  //     textColor: 'rgb(68, 10, 184)',
  //     backgroundColor: 'rgb(211, 200, 229)',
  //   },
  // ];
  highlightedDates:any = []

  eventsForSelectedDate: Event[] = [];

  constructor(private modalController: ModalController, private eventsService: EventsService,
    private changeDetectorRef: ChangeDetectorRef,private loginService: LoginService, public helpModal: ModalController,
    public router: Router,private _snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef) { }
SetValue(e:any){
  console.log(e)
  console.log(e.target.value)
this.selectedDate =  e.target.value;
this.selectedDate = this.selectedDate.substring(0,this.selectedDate.indexOf('T')).toString()
console.log(this.selectedDate)
console.log(typeof(this.selectedDate))


console.log(this.highlightedDates)
//this.changeDetectorRef.detectChanges()

}
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
    modal.onDidDismiss().then((dataReturned) => {
      if(dataReturned.data){
        //alert(dataReturned)
        this.ngOnInit()
        window.location.reload()
        this.ShowSnackBar("Event Successfully Added", "success");
      }
      
    })
  }
  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }

  Navigate(){
    this.router.navigate(['/home'])
  }

  loadEventsForSelectedDate() {
    this.eventsForSelectedDate = this.events.filter((event) => event.date === this.selectedDate);
    //this.eventsForSelectedDate = this.eventsService.getEventsForDate(this.selectedDate);
    //console.log('Events for this date: ', this.eventsForSelectedDate);

  }

  ngOnInit(): void {
  this.loginService.GetEvents().subscribe(res => {
      this.events = res
      console.log(this.events)
      this.highlightedDates = []
    this.events.forEach((element:any) => {
      console.log(element.date)
      let val = this.highlightedDates.find((item:any) => item.date == element.date)
      console.log(val)
      if(val==null){
        this.highlightedDates.push({
          date: element.date,
          textColor: 'rgb(0, 0, 255)',
          backgroundColor: 'rgb(153, 204, 255)'
        })
      }

        let exists = false
       
        
      
   
    console.log(this.highlightedDates)
    
  })
  this.cdr.detectChanges()
  })
  
}
ViewEvents(){
  console.log(this.filteredEvents)
  console.log(this.selectedDate)
  console.log(this.events.filter((event) => event.date === this.selectedDate))
  let events:any[] = this.events.filter((event) => event.date === this.selectedDate);
  console.log(events)
  this.filteredEvents = of(events);
}
async showHelp(){
  const modal = await this.helpModal.create({
    component: CalenderHelpComponent});
    return await modal.present();
}

  

  isEventDay(date: string): boolean {
    const eventsForDate = this.eventsService.getEventsForDate(date);
    return eventsForDate.length > 0;
  }

  getEventDayClass(date: string): string {
    return this.isEventDay(date) ? 'event-day' : '';
  }

  
  
}
