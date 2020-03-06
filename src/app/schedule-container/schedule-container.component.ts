import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DayService, DragAndDropService, EventSettingsModel, TimeScaleModel, ScheduleComponent, GroupModel, WeekService, ResizeService, ResizeEventArgs } from '@syncfusion/ej2-angular-schedule';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Competition } from '../models/competition.model';
import { TestBlock } from '../models/testblock.model';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { GlobalUpdateService } from '../global-update.service';

@Component({
  selector: 'app-schedule-container',
  providers: [DayService, DragAndDropService, WeekService, ResizeService],
  templateUrl: './schedule-container.component.html',
  styleUrls: ['./schedule-container.component.css'],
  animations: [
    trigger('openClose', [
      state('show', style({marginLeft: '0'})),
      state('hidden', style({minWidth: 0, maxWidth: 0})),
      transition('show <=> hidden', [
        animate('500ms ease')
      ])
    ]),
  ]
})

export class ScheduleContainerComponent implements OnInit {
  currentCompetition: Competition;
  menuState = 'show';

  loading = true;

  constructor(
    private competitionHandler: CompetitionHandlerService,
    private updater: GlobalUpdateService
  ) { }

  ngOnInit() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        this.loading = false;
        this.currentCompetition = competition;
      },
      err => console.log(err)
    );
  }

  toggleMenu(e) {
    this.menuState = e;
  }

}
