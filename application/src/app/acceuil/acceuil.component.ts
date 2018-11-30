import { GetRdvService } from '../../app/services/getRdv.service';
import * as firebase from 'firebase';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./acceuil.component.scss'],
  templateUrl: './acceuil.component.html'
})

export class AcceuilComponent {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];


  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = false;


  uid: string;
  service: GetRdvService;
  name: string;

  async updateFromDB() {
    const db: any = await this.service.getDB("/conseillers/" + this.name);

    if (!db.calendar) {
      this.events = [];
      return;
    }
    const agenda: any = db.calendar;
    let index = 0;
    Object.keys(agenda).forEach((element: any) => {
      let date = agenda[element].date.split("/");
      let hour = agenda[element].hour.split(":");
      let newDate: Date = new Date(+date[2], +date[1] - 1, +date[0], +hour[0], +hour[1]);
      let title: any;
      let color: any;
      if (agenda[element].reservation) {
        title = "Reserved by " + agenda[element].reservation;
        color = colors.red;
      } else {
        title = agenda[element].name;
        color = colors.blue;
      }

      if (this.events[index]) {
        this.events[index].start = newDate;
        this.events[index].title = title;
        this.events[index].color = color;
      } else {
        this.events.push({
          start: newDate,
          title: title,
          color: color,
          actions: this.actions,
          draggable: true
        });
      }
      index += 1;
    });
    this.refresh.next();
  }

  ngOnInit() {
    this.uid = firebase.auth().currentUser.uid;
    this.service = new GetRdvService();
    this.service.getDB("/conseillers").then((data: any) => {
      this.name = Object.keys(data).filter(x => data[x].id === this.uid)[0];
      firebase.database().ref('conseillers/'+this.name).on('value', snapshot => {
        console.log("Change received from DB");
        this.updateFromDB();
      });
      data = data[this.name];
      console.log(data);
      const calendar: any[] = data.calendar;
      if (!calendar) return;
      console.log(calendar);
      calendar.forEach(element => {
        const date: string[] = element.date.split("/");
        const hour: string[] = element.hour.split(":");
        this.events.push({
          start: new Date(+date[2], +date[1] - 1, +date[0], +hour[0], +hour[1]),
          title: element.name,
          color: colors.blue,
          actions: this.actions,
          draggable: true
        });
      });
      this.refresh.next();
    });
  }


  constructor(private modal: NgbModal) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    console.log("CHANGING!");
    event.start = newStart;
    event.end = new Date (newStart.getTime() + (1 * 60 * 60 * 1000));
    this.handleEvent('Dropped or resized', event);
    this.updateDataBase();
    this.refresh.next();
  }

  async updateDataBase() {
    let before = await this.service.getDB("/conseillers/" + this.name + "/calendar");
    let index = 0;
    let tmp;
    let newObj: any = {}
    Object.keys(before).forEach(element => {
      newObj[index.toString()] = null;
      index++;
    });
    index = 0;
    this.events.forEach(element => {
      tmp = element.start;
      let reservation: string = element.title.indexOf("Reserved by ") >= 0 ? element.title.replace('Reserved by ', '') : null;

      console.log(reservation);

      let data = {
        date: tmp.toDateString().split(" ")[2].padStart(2, '0') + "/" + (tmp.getMonth() + 1).toString().padStart(2, '0') + "/" + tmp.getFullYear().toString(),
        hour: tmp.getHours().toString().padStart(2, '0') + ":" + tmp.getMinutes().toString().padStart(2, '0'),
        name: element.title,
        reservation: reservation
      }
      newObj[index.toString()] = data;
      index++;
    });
    this.service.updateDb("/conseillers/" + this.name + "/calendar", newObj);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(): void {
    let newDate = startOfDay(new Date());
    this.events.push({
      title: 'New disponibility',
      start: newDate,
      color: colors.blue,
      draggable: true,
    });
    this.updateDataBase();
    this.refresh.next();

  }
}
