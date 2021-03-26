import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';
import { DayService, DragAndDropService, WeekService, ResizeService, EventSettingsModel, TimeScaleModel, GroupModel, ScheduleComponent as Scheduler, ResizeEventArgs, DragEventArgs, WorkHoursModel, Timezone } from '@syncfusion/ej2-angular-schedule';
import { Competition } from '../models/competition.model';
import { TestBlock } from '../models/testblock.model';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MessageService } from 'primeng/api';
import { TestFull } from '../models/test-full.model';
import {MenuItem} from 'primeng/api';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-schedule',
  providers: [DayService, DragAndDropService, WeekService, ResizeService],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @Input() competition: Competition;
  menuState = 'show';

  @ViewChild('scheduleObj', { static: false })
  public scheduleObj: FullCalendarComponent;

  loading = true;

  events: any[] = [];

  public calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  public calendarViews = {};

  public timeFormat = {
    hour: "2-digit",
    minute: "2-digit",
    meridiem: false,
    hour12: false
  }

  public columnHeaderTimeFormat = {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  }

  public slotLabelTimeFormat = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  selectionStart: Date;
  selectionEnd: Date;
  unscheduledTests: TestFull[] = [];

  showNewBlockSidebar: boolean = false;

  showBlockEditSidebar: boolean = false;
  activeBlock: TestBlock = null;

  sidebarButtons = [
    {
      icon: "pi pi-trash",
      style: "ui-button-danger",
      name: "deleteBlock"
    }
  ]

  constructor(private competitionHandler: CompetitionHandlerService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.calendarViews = {...this.calendarViews,
      timeGridCompetition: {
        type: 'timeGrid',
        duration: { days: this.competition.getDays()},
        allDaySlot: false
      }
    };
      
    console.log(this.competition.startdate);

    this.competitionHandler.getSchedule(this.competition._links.schedule).subscribe(
      tests => {
        this.events = tests;
        console.log(this.events);
      }
    );
  }

  parseEvent(testblock: TestBlock) {
    console.log(testblock.test.testcode, testblock.test.origcode);
    const colours = testblock.getColour();
    return {
      id: testblock._links.self,
      title: testblock.label,
      start: testblock.starttime,
      end: testblock.endtime,
      color: colours.bg,
      textColor: colours.text,
      extendedProps: {
        testblock: testblock
      }
    }
  }

  saveEvent({event}) {
    this.competitionHandler.updateSchedule(event.extendedProps.testblock._links.self, {
      starttime: event.start
    }).subscribe(
      block => {
        event.setExtendedProp("testblock", block);
      }
    );
  }

  updateBlockLength({event}) {
    let block = event.extendedProps.testblock;

    block.endtime = event.end;

    console.log(block);

    let params;

    if (block.phase === "PREL") {
      params = {
        groups: block.groupsFromDuration()
      };
    } else {
      params = {
        grouptime: (block.endtime.getTime() - block.starttime.getTime()) / 1000 / 60
      };
    }

    this.competitionHandler.updateSchedule(block._links.self, params).subscribe(
      block => {
        event.setExtendedProp("testblock", block);

        const src = this.events[this.findEventIndex(block._links.self)];
        src.end = block.getEndTime
      }
    );
  }

  timeSelect(event) {
    this.selectionStart = event.start;
    this.selectionEnd = event.end;

    this.competitionHandler.getUnscheduledTests(this.competition._links.self).subscribe(
      tests => {
        this.unscheduledTests = tests;
        this.showNewBlockSidebar = true;
        console.log(this.unscheduledTests);
      },
      err => console.log(err)
    );
  }

  addEvent(block: TestBlock) {
    this.events = [
      ...this.events,
      block
    ];
    this.showNewBlockSidebar = false;
  }

  deleteActiveBlock() {

    this.competitionHandler.deleteTestBlock(this.activeBlock._links.self).subscribe(
      res => {
        let newEvents = [...this.events];
        newEvents.splice(this.findEventIndex(this.activeBlock._links.self), 1);
        this.events = newEvents;
        this.showBlockEditSidebar = false;
      }
    );
  }

  showEditSidebar({event}) {
    console.log(event);
    this.activeBlock = event.extendedProps.testblock;

    this.showBlockEditSidebar = true;
  }

  findEventIndex(uri: string): number {
    return this.events.findIndex(block => block._links.self === uri);
  }

  handleSidebarAction(action) {
    switch(action) {
      case 'deleteBlock':
        this.deleteActiveBlock();
        break;
    }
  }

}
