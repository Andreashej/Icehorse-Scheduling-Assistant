import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';
import { DayService, DragAndDropService, WeekService, ResizeService, EventSettingsModel, TimeScaleModel, GroupModel, CellClickEventArgs, ScheduleComponent as Scheduler, ResizeEventArgs, DragEventArgs, WorkHoursModel } from '@syncfusion/ej2-angular-schedule';
import { Competition } from '../models/competition.model';
import { TestBlock } from '../models/testblock.model';
import { Venue } from '../models/venue.model';
import { Internationalization } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-schedule',
  providers: [DayService, DragAndDropService, WeekService, ResizeService],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  @Input() competition: Competition;
  menuState = 'show';

  @ViewChild('scheduleObj', { static: false })
  public scheduleObj: Scheduler;

  public instance: Internationalization = new Internationalization();

  public eventSettings: EventSettingsModel = {
    fields: {
      id: 'id',
      subject: { name: 'label', title: 'Testcode' },
      startTime: { name: 'starttime', title: 'Start Time' },
      endTime: { name: 'endtime', title: 'End Time'}
    }
  };

  public timeScale: TimeScaleModel = {
    slotCount: 12,
    interval: 60,
    enable: true,
  };

  public group: GroupModel = null;

  public workHours: WorkHoursModel = {
    highlight: false
  }

  loading = true;

  constructor(private competitionHandler: CompetitionHandlerService) { }

  ngOnInit() {
    if(this.competition.venues[0].name !== 'default') {
      this.group = {
        byDate: true,
        resources: ['Venues'],
      };
    }
  }

  ngAfterViewInit() {
    this.scheduleObj.timezone = 'UTC';
  }

  onCreate() {
    this.competitionHandler.getSchedule(this.competition._links.schedule).subscribe(
      tests => this.scheduleObj.eventSettings.dataSource = tests
    );
  }

  dragStart(args: DragEventArgs) {
    args.scroll = { enable: true, scrollBy: 5, timeDelay: 200 };
  }

  dragEnd(e: DragEventArgs) {
    const test: TestBlock = new TestBlock().deserialize(e.data, true);

    this.competitionHandler.updateSchedule(test._links.self, {
      starttime: test.starttime,
      venue: test.venue
    }).subscribe(
      test => this.updateTestBlock(test._links.self, test),
      (err) => console.log(err)
    );
  }

  onResizeStart(event: ResizeEventArgs) {
    // const block = new TestBlock().deserialize(event.data, true);

    // event.interval = block.test.grouptime as number;
    event.interval = 5;
    
  }

  onResize(event: ResizeEventArgs) {
    let block = new TestBlock().deserialize(event.data, true);

    // block.endtime = event.endTime;
  }

  onResizeStop(event: ResizeEventArgs) {
    const block = new TestBlock().deserialize(event.data, true);
    
    let values = null;

    if (block.phase == 'PREL') {
      values = {
        groups: block.groupsFromDuration()
      };
    } else {
      values = {
        grouptime: (block.endtime.getTime() - block.starttime.getTime()) / 1000 / 60
      }
    }

    this.competitionHandler.updateSchedule(block._links.self, values).subscribe(
      block => {
        event.data.groups = block.groups;
        this.scheduleObj.saveEvent(event.data);
      }
    );
  }

  updateTestBlock(uri: string, values: Object): void {
    console.log(this.scheduleObj.eventSettings.dataSource);
    const update = (this.scheduleObj.eventSettings.dataSource as TestBlock[]).find(event => event._links.self === uri);

    for (const [key, value] of Object.entries(values)) {
      update[key] = value;
    }
  }

  onCloseClick(e?): void {
    this.scheduleObj.quickPopup.quickPopupHide();
  }

  updateSchedule(e) {
    this.onCloseClick();
    this.scheduleObj.addEvent(e);
  }

  deleteTest(e) {
    const block = new TestBlock().deserialize(e);
    this.competitionHandler.deleteTestBlock(block._links.self).subscribe(
      res => {
        this.scheduleObj.deleteEvent(e.id)
        this.onCloseClick();
      }
    );
  }

}
