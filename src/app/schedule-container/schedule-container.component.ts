import { Component, OnInit, ViewChild } from '@angular/core';
import { DayService, DragAndDropService, EventSettingsModel, TimeScaleModel, CellClickEventArgs, ScheduleComponent, GroupModel, PopupEventArgs, WeekService } from '@syncfusion/ej2-angular-schedule';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Competition } from '../models/competition.model';
import { Test } from '../models/test.model';
import { Venue } from '../models/venue.model';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-schedule-container',
  providers: [DayService, DragAndDropService, WeekService],
  templateUrl: './schedule-container.component.html',
  styleUrls: ['./schedule-container.component.css'],
  animations: [
    trigger('openClose', [
      state('show', style({marginLeft: '0'})),
      state('hidden', style({minWidth: 0, maxWidth: 0})),
      transition('show <=> hidden', [
        animate('100ms linear')
      ])
    ]),
  ]
})

export class ScheduleContainerComponent implements OnInit {
  currentCompetition: Competition;
  // scheduledTests: Test[] = [];
  // unscheduledTests: Test[] = [];
  menuState = 'show';

  @ViewChild('scheduleObj', { static: false })
  public scheduleObj: ScheduleComponent;

  public eventSettings: EventSettingsModel = {
    // dataSource: this.scheduledTests,
    fields: {
      id: 'id',
      subject: { name: 'testcode', title: 'Testcode' },
      startTime: { name: 'starttime', title: 'Start Time' },
      endTime: { name: 'endtime', title: 'End Time'}
    }
  };

  public timeScale: TimeScaleModel = {
    slotCount: 12,
    interval: 60,
    enable: true
  };

  public group: GroupModel = null;

  loading = true;

  constructor(private competitionHandler: CompetitionHandlerService) { }

  ngOnInit() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        this.loading = false;
        this.currentCompetition = competition;
        
        if(this.currentCompetition.venues[0].name !== 'default') {
          this.group = {
            byDate: true,
            resources: ['Venues'],
          };
        }
      },
      err => console.log(err)
    );
    
  }

  onCreate() {
    this.competitionHandler.getTests(this.currentCompetition.uri, ).subscribe(
      tests => this.scheduleObj.eventSettings.dataSource = tests
    );
  }

  onDrag(e) {
    document.getElementsByTagName('body')[0].appendChild(e.event.element);
  }

  dragEnd(e) {
    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(e.event.target);
    let test: Test = new Test().deserialize(e.data);
    e.event.element.remove();

    if (!cellData) {
      if (test.starttime) {
        test.starttime = null;
        this.scheduleObj.deleteEvent(test.uri);
      }
      this.unscheduledTests.push(test);
    } else {
      const inSchedule = (test.starttime) ? true : false; // Define variable to check if test is already in schedule
      
      if (!inSchedule) {
        test.starttime = cellData.startTime;
        test.endtime = test.getEndTime();
        const venue: Venue = new Venue().deserialize(this.scheduleObj.getResourcesByIndex(cellData.groupIndex).resourceData);
        test.venue = venue;
        test.venue_uri = venue.uri;

        this.scheduleObj.addEvent(test);
      } else {
        if (!test.starttime) {
          this.unscheduledTests.push(test);
        }
      }
    }
    // console.log(test);
    this.competitionHandler.updateTest(test.uri, test).subscribe(
      (res) => {
        test = res;
      },
      (err) => console.log(err)
    );
  }

  onPopupOpen(args: PopupEventArgs) {
    // args.cancel = true;

    // if (args.type === 'Editor') {
    //   // let statusElement: HTMLInputElement = args.element.querySelector('#EventType') as HTMLInputElement;
    //   // if (!statusElement.classList.contains('e-dropdownlist')) {
    //   //     let dropDownListObject: DropDownList = new DropDownList({
    //   //         placeholder: 'Choose status', value: statusElement.value,
    //   //         dataSource: ['New', 'Requested', 'Confirmed']
    //   //     });
    //   //     dropDownListObject.appendTo(statusElement);
    //   //     statusElement.setAttribute('name', 'EventType');
    //   // }

    //   let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
    //   if (!startElement.classList.contains('e-datetimepicker')) {
    //       new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
    //   }
    //   let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
    //   if (!endElement.classList.contains('e-datetimepicker')) {
    //       new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
    //   }
    // }

  }

  toggleFinal(test: Test, type: string) {
    var fin = new Test(test.testcode, test.origcode, 1, 0, type);
    if (!test[type.toLowerCase()]) {
      this.competitionHandler.createTest(this.currentCompetition.uri, fin).subscribe(
        res => {
          this.unscheduledTests.push(res);
          console.log(res);
          test[type.toLowerCase()] = res.uri;
          this.competitionHandler.updateTest(test.uri, test).subscribe(
            res => {
              test = res;
              console.log(test);
            },
            err => console.log(err)
          );
        },
        err => console.log(err)
      );
    } else {
      this.competitionHandler.deleteTest(test[type]).subscribe(
        res => console.log(res),
        err => console.log(err)
      )
    }
  }

  toggleMenu(e) {
    this.menuState = e;
  }

  // dataBinding(): void {
  //   this.scheduleObj.adjustEventWrapper(); 
  // }

  // onActionComplete(args: ActionEventArgs): void {
  //   if (args.requestType === 'dateNavigate' || args.requestType === 'viewNavigate') { 
  //     this.scheduleObj.adjustEventWrapper(); 
  //   } 
  // }
}
