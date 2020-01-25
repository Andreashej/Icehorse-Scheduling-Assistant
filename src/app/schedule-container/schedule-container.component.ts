import { Component, OnInit, ViewChild, OnDestroy, OnChanges } from '@angular/core';
import { DayService, WeekService, View, DragAndDropService, EventSettingsModel, TimeScaleModel, CellClickEventArgs, ScheduleComponent, ResourceDetails, ActionEventArgs, GroupModel, PopupEventArgs, ExportOptions, ExcelExportService, ICalendarExport, ICalendarExportService } from '@syncfusion/ej2-angular-schedule';
import { FieldsSettingsModel } from '@syncfusion/ej2-angular-navigations';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Competition } from '../models/competition.model';
import { Test } from '../models/test.model';
import { Venue } from '../models/venue.model';
import { DateTimePicker } from '@syncfusion/ej2-calendars';

@Component({
  selector: 'app-schedule-container',
  providers: [DayService, WeekService, DragAndDropService, ExcelExportService, ICalendarExportService],
  templateUrl: './schedule-container.component.html',
  styleUrls: ['./schedule-container.component.css'],
})
export class ScheduleContainerComponent implements OnInit, OnChanges {
  currentCompetition: Competition;
  scheduledTests: Test[] = [];
  unscheduledTests: Test[] = [];

  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;

  eventSettings: EventSettingsModel = {
    dataSource: this.scheduledTests,
    fields: {
      id: 'uri',
      subject: { name: 'testcode', title: 'Testcode' },
      startTime: { name: 'starttime', title: 'Start Time' },
      endTime: { name: 'endtime', title: 'End Time'}
    }
  };

  timeScale: TimeScaleModel = {
    slotCount: 12,
    interval: 60
  };

  // Resources dummy vars

  group: GroupModel = {
    byDate: true,
    resources: ['Venues'],
  }

  constructor(private competitionHandler: CompetitionHandlerService) { }

  ngOnInit() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        this.currentCompetition = competition;
        this.competitionHandler.getTests(this.currentCompetition.uri).subscribe(
          tests => {
            console.log(tests);
            for (let test of tests) {
              if (test.starttime) {
                this.scheduledTests.push(test);
              } else {
                this.unscheduledTests.push(test);
              }
            }
            this.scheduleObj.refreshEvents();
          }
        );
      }
    );
  }

  ngOnChanges() {
    console.log(this.scheduledTests);
  }

  checkAction(e) {
    console.log(e);
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
        // console.log(res);
        res = test;
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

  print(): void {
    this.scheduleObj.exportToICalendar(this.currentCompetition.name.replace(' ', '-') + '-schedule');
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
